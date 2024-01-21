import 'react-native-gesture-handler'; // Import this at the top
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Login';
import Dashboard from '../Dashboard';

// ************************************************
// Lead
import Lead from '../view/lead/Lead';
import LeadCreate from '../view/lead/LeadCreate';
import LeadDetails from '../view/lead/LeadDetails';
import LeadUpdate from '../view/lead/LeadUpdate';
import ActivityCreateMeeting from '../view/lead/activity/ActivityCreateMeeting';

// Meeting
import MettingList from '../view/metting/MettingList';
import MeetingDetails from '../view/metting/MeetingDetails';
import MettingUpdate from '../view/metting/MettingUpdate';

// Map View
import Map from '../view/map/Map';

// Task
import TaskList from '../view/task/TaskList';
import TaskCreate from '../view/task/TaskCreate';
import TaskDetails from '../view/task/TaskDetails';
import TaskUpdate from '../view/task/TaskUpdate';

// *****************************************************
// deal
import DealList from '../view/deal/DealList';
import DealCreate from '../view/deal/DealCreate';
import DealDetails from '../view/deal/DealDetails';

// profile
import Profile from '../view/profile/Profile';

// Call

import CalList from '../view/call/CalList'
import CallDetails from '../view/call/CallDetails'



const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Lead" component={Lead} />
      <Stack.Screen name="LeadCreate" component={LeadCreate} />
      <Stack.Screen name="LeadDetails" component={LeadDetails} />
      <Stack.Screen name="LeadUpdate" component={LeadUpdate} />
      <Stack.Screen name="ActivityCreateMeeting" component={ActivityCreateMeeting} />
      <Stack.Screen name="MettingList" component={MettingList} />
      <Stack.Screen name="MeetingDetails" component={MeetingDetails} />
      <Stack.Screen name="MettingUpdate" component={MettingUpdate} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="TaskList" component={TaskList} />
      <Stack.Screen name="TaskCreate" component={TaskCreate} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen name="TaskUpdate" component={TaskUpdate} />
      <Stack.Screen name="DealList" component={DealList} />
      <Stack.Screen name="DealCreate" component={DealCreate} />
      <Stack.Screen name="DealDetails" component={DealDetails} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="CalList" component={CalList} />
      <Stack.Screen name="CallDetails" component={CallDetails} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
