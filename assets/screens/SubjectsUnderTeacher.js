import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList} from "react-native";
import { Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from 'moment';
import { fb } from "../../firebase";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
const db = fb.firestore();

const SubjectsUnderTeacher = ({ route, navigation }) => {
  const { id, sy, level} = route.params
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const _goBack = () => navigation.goBack(null);
  const _handleMore = () => navigation.navigate("AddSubjects");
  const [options, setOptions] = useState(
    { year: "numeric", month: "long", day: "numeric" }
  )

  useEffect(() => {
    var teacherRef = db.collection("teachers").doc(id);

    teacherRef.get().then((doc) => {
        if (doc.exists) {
            setSubjects(doc.data().subjects);
            setIsLoading(false);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }, [])


  const renderAgency = ({ item, index }) => (
        <List.Item
            title={item}
            titleStyle={{fontWeight: 'bold'}}
            /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
            description={`All asigned teachers in ${level}`}
            left={props => <List.Icon {...props} icon="notebook-outline" />}
            onPress={() => navigation.navigate("StudentsUnderSubjectsTeacher", {
              subject: item,
              teacherId: id,
              sy: sy,
              level: level
            })}
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
        <Appbar.Content title="Subjects" subtitle="All subjects with assigned teachers" />
      </Appbar.Header>
      {subjects.length > 0 ? (
          <FlatList
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          data={subjects}
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

export default SubjectsUnderTeacher;
