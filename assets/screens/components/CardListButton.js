import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Appbar,
  Avatar,
  Chip,
  Card,
  Button,
  Title,
  Paragraph,
} from "react-native-paper";

const CardListButton = (props) => {
  const navigation = useNavigation();
  return (
    <>
      <Card
        onPress={() => {
          navigation.navigate("Grades", {
            type: props.type,
            userId: props.userId
          });
        }}
        style={{ elevation: 7 }}
      >
        <Card.Content>
          <Title style={{ fontWeight: "bold" }}>STUDENT GRADES</Title>
        </Card.Content>
        <Card.Cover
          /* blurRadius={1} */
          style={{ marginTop: 10 }}
          source={{
            uri:
              "http://www.aftabhussain.com/images/report_card.jpg?fbclid=IwAR1riRvqyhHIaRiSsnsCRjk4tz7llB99Rmx3ZHVFx4bTqANfV1yWMZis5u0",
          }}
        />
      </Card>
      <Card
        style={{ marginTop: 20, elevation: 7 }}
        onPress={() => {
          navigation.navigate("Subjects", {
            type: props.type,
          });
        }}
      >
        <Card.Content>
          <Title style={{ fontWeight: "bold" }}>SUBJECTS</Title>
        </Card.Content>
        <Card.Cover
          /* blurRadius={1} */
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://prepskills.com/wp-content/uploads/2018/07/SAT-Subject-Tests.jpg?fbclid=IwAR1heeg-cVNRDBNP7YLCwfwWVBdGvIg5DwTRpWrw_QzdeTmvazhy-I7jFYQ",
          }}
        />
      </Card>
      <Card
        style={{ marginTop: 20, elevation: 7 }}
        onPress={() => {
          navigation.navigate("Teachers", {
            type: props.type,
          });
        }}
      >
        <Card.Content>
          <Title style={{ fontWeight: "bold" }}>TEACHERS</Title>
        </Card.Content>
        <Card.Cover
          /* blurRadius={1} */
          style={{ marginTop: 10 }}
          source={{
            uri:
              "http://clipart-library.com/newimages/teacher-clip-art-3.jpg",
          }}
        />
      </Card>
      <Card
        style={{ marginTop: 20, elevation: 7 }}
        onPress={() => {
          navigation.navigate("SchoolYear", {
            type: props.type,
          });
        }}
      >
        <Card.Content>
          <Title style={{ fontWeight: "bold" }}>SCHOOL YEAR</Title>
        </Card.Content>
        <Card.Cover
          /* blurRadius={1} */
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://www.rd.com/wp-content/uploads/2017/07/Heres-Why-The-School-Year-Doesnt-Start-in-January-ft.jpg?w=1000&fbclid=IwAR0vUPnCm53y6TD40N1Cx_0das9kZSednO7P2c-ilrkdEjgGZcYUCASrq-M",
          }}
        />
      </Card>
      {props.type === "Admin" && (
        <Card style={{ marginTop: 20, elevation: 7 }}
          onPress={() => {
            navigation.navigate("CommentsList", {
              type: props.type,
            });
          }}
        >
          <Card.Content>
            <Title style={{ fontWeight: "bold" }}>View Comments</Title>
          </Card.Content>
          <Card.Cover
            /* blurRadius={1} */
            style={{ marginTop: 10 }}
            source={{
              uri:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkZnvsUyPBHkcdlP6PO_zlTGAm-P1yyBDYXg&usqp=CAU",
            }}
          />
        </Card>
      )}
      <Card style={{ marginTop: 20, marginBottom: 40, elevation: 7 }}
        onPress={() => {
          navigation.navigate("SchoolInformation", {
            type: props.type,
          });
        }}
      >
        <Card.Content>
          <Title style={{ fontWeight: "bold" }}>School Information</Title>
        </Card.Content>
        <Card.Cover
          /* blurRadius={1} */
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://www.stannespatnacity.in/wp-content/uploads/2016/12/schoolinfo2.png?fbclid=IwAR2YW6JZ9-Z_wWiqQKfgJGVQilWGEUg7-fhj62UPwW78Pov4NPmAXugWe2o",
          }}
        />
        
      </Card>
    </>
  );
};

export default CardListButton;
