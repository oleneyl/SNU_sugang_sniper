import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as action from '../action';
import axios from  'axios';
import {colors} from '../constant/style';
import ConnectionStatus from './connectionStatus';
import socketIOClient from "socket.io-client";

const SOCKET_URL = 'localhost:3030';

const establishConnection = (actions) => {
    const socket = socketIOClient(SOCKET_URL);
    socket.on('detectedChange', (msg) => {
        actions.addText(msg);
        let notification = new Notification(msg.title, {body : msg.body});
        setTimeout(function () {
            notification.close();
        }, 5000);
    });
    socket.on('connect', ()=>{
        actions.updateConnection(true);
    });
    socket.on('disconnect', ()=>{
        actions.updateConnection(false);
    });
    return socket;
}

class DetectionTextpiece extends Component {
    render(){
        return (
            <div style={{
                textAlign : this.props.log.location,
                margin : this.props.log.location === 'right' ? '0 0 0 400px' : '0 400px 0 0'
            }}>
                <div style={{
                    margin : 2,
                    padding : 5,
                    borderRadius : 5,
                    border : '1px solid' + colors.GREEN
                }}>
                    {this.props.log.text}
                </div>
            </div>
        )
    }
}

class DetectionLog extends Component {
    render(){
        return (
            <div style={{
                height:'80%'
            }}>
                {this.props.logs.toJS().map((log, idx) => <DetectionTextpiece log={log}/>)}
            </div>
        )
    }
}

class Header extends Component {
    render(){
        return (<div style={{
            width : '100%',
            height : 60,
            backgroundColor : '#cacaca',
        }}>
            <ConnectionStatus {...this.props} tryConnect={establishConnection}/>
        </div>)
    }
}

class Client extends Component {
    render(){
        return (
            <div>
                <Header {...this.props}/>
                <div style={{display:'flex'}}>
                    <div style={{
                        width : 600,
                        height : 600,
                        border : '1px solid '+colors.GREEN
                    }}>
                        <div style={{
                            backgroundColor : colors.GREEN,
                            height : 50
                        }}>
                            Detection Log
                        </div>
                        <DetectionLog logs={this.props.logs}/>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(
    (state) => ({
        logs : state.get('logs'),
        connection : state.get('connection')
    }),
    (dispatch) => ({
        actions : bindActionCreators(action, dispatch),
    })
)(Client);