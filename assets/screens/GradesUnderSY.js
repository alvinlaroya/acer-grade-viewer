import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList} from "react-native";
import { Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from 'moment';
import { fb } from "../../firebase";
const db = fb.firestore();

const GradesUnderSY = ({route, navigation }) => {
  const { sy, type, userId } = route.params;
  const [school_year, setSchoolYear] = useState([]);
  const [stage, setStage] = useState([
    {name: 'Grade1'},
    {name: 'Grade2'},
    {name: 'Grade3'},
    {name: 'Grade4'},
    {name: 'Grade5'},
    {name: 'Grade6'},
    {name: 'Grade7'},
    {name: 'Grade8'},
    {name: 'Grade9'},
    {name: 'Grade10'},
    {name: 'Grade11'},
    {name: 'Grade12'},
  ])

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
            title={item.name}
            titleStyle={{fontWeight: 'bold'}}
            /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
            description={`List of students in ${item.name}`}
            left={props => <List.Icon {...props} icon="notebook-outline" />}
            onPress={() => {
              if(type === "Student") {
                navigation.navigate("StudentMyGrades", {
                  id: userId,
                  sy: sy,
                  level: item.name,
                  type: type
                })
              } else if(type === "Guardian") {
                navigation.navigate("StudentMyGrades", {
                  id: userId,
                  sy: sy,
                  level: item.name,
                  type: type
                })
              } else if(type === "Teacher") {
                navigation.navigate("SubjectsUnderTeacher", {
                  id: userId,
                  sy: sy,
                  level: item.name
                })
              } else {
                navigation.navigate("GradesList", {
                  sy: sy,
                  stage: item.name,
                  type: type
                })
              }
            }}
        />
    )

  return isLoading ? (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Loading...</Text>
    </View>
  ) : (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <Appbar.Header style={{ marginTop: 1, backgroundColor: "white", marginTop: Constants.statusBarHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title={sy} subtitle={`List of levels in ${sy}`} />
      </Appbar.Header>
      {school_year.length > 0 ? (
          <FlatList
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          data={stage}
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

export default GradesUnderSY;
