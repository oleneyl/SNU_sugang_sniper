const app = require('express')();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const get_subject_status = require('./subjectQuery');

const configuration = require('./configuration');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('detectedChange', msg);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});

start_polling = (subject_id, interval, options = {}) => {
    const timer_id = setInterval(
        () => get_subject_status(subject_id, options).then((res) => {
            //let alertBody = res;
            let alertBody = res.filter(x => x.current < x.maximum);
            if(alertBody.length > 0){
                alertBody = alertBody.reduce((acc, curr) => acc + curr.teacher + ':' + curr.name + '[' + curr.current + '/' + curr.maximum + ']\n', '');
                let title = 'Detected!';
                io.emit('detectedChange', {
                    title : title,
                    body : alertBody
                });
            }
        })
    , interval);
    return timer_id;
}


configuration.map(obj=> {
    if(obj.profName){
        start_polling(obj.id, obj.polling_interval, {profName:obj.profName});
    }else{
        start_polling(obj.id, obj.polling_interval);
    }
})

http.listen(3030, () => {
    console.log('Connected at 3030');
})