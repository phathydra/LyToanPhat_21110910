import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import formatTime from 'minutes-seconds-milliseconds';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: [],
      isFirstRun: true,
      lapTime: null,
      lapTimeElapsed: null,
      reset: false
    };
    this.handleStartPress = this.handleStartPress.bind(this);
    this.startStopButton = this.startStopButton.bind(this);
    this.handleLapPress = this.handleLapPress.bind(this);
  }
  
  laps(){
    var reverseLaps = [...this.state.laps]
    var length = reverseLaps.length;
    var curTime = this.state.lapTimeElapsed;
    return reverseLaps.reverse().map(function(time, index){
      var reverseIndex = length - index - 1;
      var last = false;
      if(reverseIndex === length - 1){
        last = true;
      }
      return <View key={reverseIndex} style={styles.lap}>
        <Text style={styles.lapText}>
          Lap #{reverseIndex + 1}
        </Text>
        <Text style={styles.lapText}>
          {last ? formatTime(curTime) : formatTime(time)}
        </Text>
      </View>
    });
  }

  startStopButton(){
    var style = this.state.running ? styles.stopButton : styles.startButton;

    return <TouchableHighlight underlayColor="gray"
                              onPress={this.handleStartPress}
                              style={[styles.button, style]}>
      <Text>
        {this.state.running ? 'Stop' : 'Start'}
      </Text>
    </TouchableHighlight>
  }

  lapButton(){
    return <TouchableHighlight style={styles.button}
                                underlayColor="gray"
                                onPress={this.handleLapPress}>
      <Text>
        {this.state.reset ? 'Reset' : 'Lap'}
      </Text>
    </TouchableHighlight>
  }

  handleLapPress(){
    var length = this.state.laps.length;
    var lap = this.state.lapTimeElapsed;
    console.log(this.state.laps);
    if(!this.state.reset){
      this.setState({laps: this.state.laps.splice(length - 1, 1, lap)})
      this.setState({
        lapTime: new Date(),
        laps: this.state.laps.concat([0])
      });
    }
    else{
      this.setState({
        startTime: new Date(),
        timeElapsed: 0,
        lapTimeElapsed: 0,
        laps: [],
        reset: false
      })
    }
  }

  handleStartPress(){
    if(this.state.running){
      clearInterval(this.interval);
      this.setState({running: false});
      this.setState({reset: true});
      return
    }
    if(this.state.isFirstRun){
      this.setState({startTime: new Date()});
      this.setState({isFirstRun: false});
    }
    this.setState({lapTime: new Date()});
    this.setState({laps: this.state.laps.concat([0])});

    this.interval = setInterval(() => {
      this.setState({
        timeElapsed: new Date() - this.state.startTime,
        lapTimeElapsed: new Date() - this.state.lapTime,
        running: true,
        reset: false
      });
    }, 30);
  }
  
  render(){
    return <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerWrapper}>
          <Text style={styles.timer}>
            {formatTime(this.state.timeElapsed)}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          {this.lapButton()}
          {this.startStopButton()}
        </View>
      </View>
      <View style={styles.footer}>
        {this.laps()}
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'black'
  },
  header:{
    flex: 1
  },
  footer:{
    flex: 1
  },
  timerWrapper:{
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper:{
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lap:{
    justifyContent: 'space-around',
    flexDirection:'row',
    borderColor: 'lightgray',
    borderWidth:2,
    padding: 10,
    marginTop: 10
  },
  button:{
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray'
  },
  timer:{
    fontSize: 60,
    color:'white'
  },
  lapText:{
    fontSize: 30,
    color: 'white'
  },
  startButton:{
    backgroundColor: 'green'
  },
  stopButton:{
    backgroundColor: 'red'
  },
  longestLapTest:{
    fontSize: 30,
    color: 'red'
  },
  shortestLapText:{
    fontSize: 30,
    color: 'green'
  }
});

export default App;
