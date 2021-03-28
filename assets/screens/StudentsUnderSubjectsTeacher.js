import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { Appbar, List, Avatar, IconButton, Snackbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from "moment";
import { fb } from "../../firebase";
const db = fb.firestore();

const student = require('../student.png')

const StudentsUnderSubjectsTeacher = ({ route, navigation }) => {
  const { subject, teacherId, sy, level} = route.params;
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const _goBack = () => navigation.goBack(null);

  useEffect(() => {
    const unsubscribe = db
      .collection("grades")
      .where("subject", "==", subject)
      .where("teacherId", "==", teacherId)
      .where("sy", "==", sy)
      .where("level", "==", level)
      .orderBy("name", "asc")
      .onSnapshot((querySnapshot) => {
        const studentsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setStudents(studentsArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderStudents = ({ item, index }) => (
    <>
      <List.Item
        title={item.name}
        titleStyle={{ fontWeight: "bold", marginLeft: 10 }}
        /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
        description={`LRN: ${item.lrn}`}
        descriptionStyle={{ marginLeft: 10 }}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={40}
            source={student}
            style={{ marginTop: 8, marginLeft: 10 }}
          />
        )}
        right={(props) => (<Text {...props} style={{fontSize: 18, fontWeight: 'bold', marginRight: 10, marginTop: 10}}>
            {level === "Grade11" || level === "Grade12" ? `${item.grade} (${item.grading}/Quarter)` : `${item.grade} (${item.grading}/Grading)`}
        </Text>)}
      />
    </>
  );

  return isLoading ? (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Loading...</Text>
    </View>
  ) : (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <Appbar.Header style={{ backgroundColor: "white", marginTop: Constants.statusBarHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content
          title={`Students enrolled in ${subject}`}
          titleStyle={{fontSize: 17}}
          subtitle={`List of students in ${subject}`}
        />
      </Appbar.Header>
      <View style={{backgroundColor: 'white', padding: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1991a1'}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Student Name</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Grade</Text>
      </View>
      {students.length > 0 ? (
        <FlatList
          style={{ backgroundColor: "white"}}
          showsVerticalScrollIndicator={false}
          data={students}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={(item) => renderStudents(item)}
          initialNumToRender={10}
          inverted={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          /* onEndReached={_handleLoadMore} */
          onEndReachedThreshold={0.5}
          /*   onRefresh={_handleRefresh}
            refreshing={refreshing} */
          getItemLayout={(data, index) => ({
            length: 40,
            offset: 40 * index,
            index,
          })}
          /*  ListFooterComponent={_renderFooter} */
          inverted={false}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>No students to display</Text>
        </View>
      )}
    </>
  );
};

export default StudentsUnderSubjectsTeacher;
