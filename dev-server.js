let express = require('express');
let app = express();

// app.get('/', (req,res) => res.redirect('/rco'));
app.use('/', express.static('dist'));

app.listen(9999, () => console.log('\nListening on port 9999'));