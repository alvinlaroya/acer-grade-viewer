import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList} from "react-native";
import { Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from 'moment';
import { fb } from "../../firebase";
const db = fb.firestore();

const SchoolYear = ({ route, navigation }) => {
  const { type } = route.params
  const [school_year, setSchoolYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const _goBack = () => navigation.goBack(null);
  const _handleMore = () => navigation.navigate("AddSchoolYear");
  const [options, setOptions] = useState(
    { year: "numeric", month: "long", day: "numeric" }
  )

  useEffect(() => {
    fetchSchoolYear();
  }, []);

  const fetchSchoolYear = () => {
    const unsubscribe = db.collection("school_year")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const schoolYearArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setSchoolYear(schoolYearArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  };

  const renderAgency = ({ item, index }) => (
        <List.Item
            title={`SY: ${item.year}`}
            titleStyle={{fontWeight: 'bold'}}
            /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
            description={item.enrolled > 0 ? `${item.enrolled} Enrolled Students` : `No Enrolled Students Yet`}
            left={props => <List.Icon {...props} icon="notebook-outline" />}
        />
    )

  return isLoading ? (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Loading...</Text>
    </View>
  ) : (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <Appbar.Header style={{ marginTop: 1, backgroundColor: "white", marginTop: Constants.statusBarHeight }}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="School Year" subtitle="All school year with enrolled student" />
        {type === "Admin" && (<Appbar.Action icon="plus" onPress={_handleMore} />)}
      </Appbar.Header>
      {school_year.length > 0 ? (
          <FlatList
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          data={school_year}
          keyExtractor={( item, index) => { return index.toString() } }
          renderItem={renderAgency}
          initialNumToRender={10}
          inverted={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          /* onEndReached={_handleLoadMore} */
          onEndReachedThreshold={0.5}
        /*   onRefresh={_handleRefresh}
          refreshing={refreshing} */
          getItemLayout={(data, index) => (
              {length: 40, offset: 40 * index, index}
          )}
         /*  ListFooterComponent={_renderFooter} */
          inverted={false}
      />
      ) : (
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text>No school year to display</Text>
          </View>
      )}
    </>
  );
};

export default SchoolYear;
