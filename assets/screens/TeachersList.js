import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList} from "react-native";
import { Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from 'moment';
import { fb } from "../../firebase";
const db = fb.firestore();

const TeachersList = ({ route, navigation }) => {
  const { subject } = route.params
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const _goBack = () => navigation.goBack(null);
  const _handleMore = () => navigation.navigate("AddSubjects");
  const [options, setOptions] = useState(
    { year: "numeric", month: "long", day: "numeric" }
  )

  useEffect(() => {
    const unsubscribe = db.collection("teachers")
      .where("subjects", "array-contains", subject)
      .onSnapshot((querySnapshot) => {
        const subjectsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setTeachers(subjectsArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);
  const renderTeachers = ({ item, index }) => (
        <List.Item
            title={`${item.fname} ${item.lname}`}
            titleStyle={{fontWeight: 'bold'}}
            /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
            description={item.position}
            left={props => <List.Icon {...props} icon="notebook-outline" />}
            onPress={() => alert(item.createdAt)}
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
        <Appbar.Content title="Teachers" subtitle={`All Teachers assigned in ${subject}`} />
      </Appbar.Header>
      {teachers.length > 0 ? (
          <FlatList
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          data={teachers}
          keyExtractor={( item, index) => { return index.toString() } }
          renderItem={item => renderTeachers(item)}
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

export default TeachersList;
