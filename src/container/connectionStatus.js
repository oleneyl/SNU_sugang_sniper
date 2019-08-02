import React, {Component} from 'react';

class ConnectionStatus extends Component {
    render(){
        return (
            <div style={{display : 'flex'}}>
                <button onClick={()=>{
                    if(!this.props.connection){
                        this.props.tryConnect(this.props.actions);
                    }
                    Notification.requestPermission(function (result) {
                        if (result === 'denied') {
                            return;
                        }
                        else {
                            return;
                        }
                    });
                }}>
                    CONNECT
                </button>
                <div style={{
                    padding : '20px 20px',
                    width : 300,
                    height : 50
                }}>
                    {this.props.connection ? 'Connection Established' : 'Not Connected'}
                </div>
            </div>
        );
    }
}

export default ConnectionStatus