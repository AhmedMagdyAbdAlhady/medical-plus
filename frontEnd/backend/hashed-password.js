const bcrypt = require("bcrypt"); 
/*
async function test() {
    const slat = await bcrypt.genSalt(10);
     console.log(slat);
}

test();
*/

async function testHashedPassword() {
    const slat = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("12345678", slat);

     console.log(slat);
     console.log(hashedPassword);
}

testHashedPassword();