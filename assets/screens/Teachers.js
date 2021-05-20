import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList} from "react-native";
import { Appbar, List, Avatar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from 'moment';
import { fb } from "../../firebase";
const db = fb.firestore();

const Teachers = ({ route, navigation }) => {
  const { type } = route.params
  const [teachers, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const _goBack = () => navigation.goBack(null);
  const _handleMore = () => navigation.navigate("AddSubjects");
  const [options, setOptions] = useState(
    { year: "numeric", month: "long", day: "numeric" }
  )

  useEffect(() => {
    const unsubscribe = db.collection("teachers")
      .orderBy("fname", "asc")
      .onSnapshot((querySnapshot) => {
        const subjectsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setSubjects(subjectsArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);
  const renderAgency = ({ item, index }) => (
        <List.Item
            title={`${item.fname} ${item.lname}`}
            titleStyle={{fontWeight: 'bold'}}
            /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
            description={item.email}
            onPress={() => navigation.navigate("TeacherProfile", {
                teacher: item,
                type: type
            })}
            left={(props) => (
                <Avatar.Image
                    {...props}
                    size={40}
                    source={{ uri: item.profile !== "" ? item.profile : "https://image.flaticon.com/icons/png/512/1089/1089129.png"}}
                    style={{ marginTop: 8, marginLeft: 10 }}
                />
            )}
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
        <Appbar.Content title="Teachers" subtitle="List of teachers" />
      </Appbar.Header>
      {teachers.length > 0 ? (
          <FlatList
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          data={teachers}
          keyExtractor={( item, index) => { return index.toString() } }
          renderItem={item => renderAgency(item)}
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
              <Text>No subjects to display</Text>
          </View>
      )}
    </>
  );
};

export default Teachers;
