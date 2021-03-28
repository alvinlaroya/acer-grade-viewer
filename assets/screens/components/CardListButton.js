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
          blurRadius={1}
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFlbXPP-7Dmxf8gPGOaUj4fKUTNmOMUglOCA&usqp=CAU",
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
          blurRadius={1}
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://image.freepik.com/free-vector/background-with-collection-different-school-subjects-study_160450-67.jpg",
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
          blurRadius={1}
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://img.freepik.com/free-vector/teacher-front-chalkboard-with-copy-space-your-text_38747-184.jpg?size=626&ext=jpg",
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
          blurRadius={1}
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGp5bfpVJB-Ef1ovg-RdpzlFO2bYw_WL9o_Q&usqp=CAU",
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
            blurRadius={1}
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
          blurRadius={1}
          style={{ marginTop: 10 }}
          source={{
            uri:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ39sDhZ9bOcNS8K8AyC7zLd4EaCZJ8ROeBrA&usqp=CAU",
          }}
        />
        
      </Card>
    </>
  );
};

export default CardListButton;
