// @ts-nocheck
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import TcpSocket from 'react-native-tcp-socket';

const port = 5555;

const App = () => {
    // Hanle Inputs

    const [username, setUserName] = useState();
    const [message, setMessage] = useState();

    const [messagesData, setData] = React.useState([]);

    // *****----

    const createServer = () => {
        const connectedClients = [];
        const server = TcpSocket.createServer(function (socket) {
            connectedClients.push(socket);
            socket.on('data', (data) => {
                socket.write(data);
                // Broadcast the message to all connected clients
                connectedClients.forEach((client) => {
                    if (client !== socket) {
                        client.write(data);
                    }
                });
            });

            socket.on('error', (error) => {
                console.log('An error ocurred with client socket ', error);
            });

            socket.on('close', (error) => {
                console.log('Closed connection with ', socket.address());
            });
        }).listen({ port: port, host: '0.0.0.0' });

        server.on('error', (error) => {
            console.log('An error ocurred with the server', error);
        });

        server.on('close', () => {
            console.log('Server closed connection');
        });
    };

    const createClient = () => {
        const options = {
            port,
            host: '192.168.1.2',
            reuseAddress: false,
        };
        // Create socket
        const client = TcpSocket.createConnection(options, () => {
            // Write on the socket
            client.write(`${username} : ${message}\r`);

            // Close socket
            // client.destroy();
        });

        client.on('data', function (data) {
            const charArray = Object.values(data).map((code) =>
                String.fromCharCode(code)
            );

            // Join the characters to form a string
            const resultString = charArray.join('');

            console.log(resultString);

            setData((el) => [...el, resultString]);

            Alert.alert('Alert Title', 'My Alert Msg', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        });

        client.on('error', function (error) {
            console.log(error);
        });

        client.on('close', function () {
            console.log('Connection closed!');
        });
    };

    return (
        <View
            style={{
                flex: 1,
                padding: 5,
                marginTop: 20,
            }}
        >
            <View
                style={{
                    width: '100%',
                    backgroundColor: 'purple',
                    padding: 10,
                }}
            >
                <TextInput
                    placeholder='Your Name'
                    style={{
                        padding: 10,
                        borderColor: 'black',
                        borderWidth: 1,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                    }}
                    onChangeText={setUserName}
                />
                <TextInput
                    placeholder='Your Message Here'
                    style={{
                        padding: 10,
                        borderColor: 'black',
                        borderWidth: 1,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        marginTop: 10,
                    }}
                    onChangeText={setMessage}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        marginTop: 10,
                    }}
                >
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: 'yellow',
                            flex: 1,
                            borderRadius: 5,
                            justifyContent: 'center',
                        }}
                        onPress={createServer}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            Create Server
                        </Text>
                    </Pressable>
                    <Pressable
                        style={{
                            padding: 10,
                            backgroundColor: 'yellow',
                            flex: 1,
                            borderRadius: 5,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                            onPress={createClient}
                        >
                            Send Message{' '}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={{ borderWidth: 2, borderColor: 'gray' }}>
                {messagesData.map((el, index) => {
                    return <Text key={index}>{el}</Text>;
                })}
            </View>
        </View>
    );
};

export default App;
