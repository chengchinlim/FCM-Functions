import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
require('custom-env').env('test')

exports.GOOGLE_APPLICATION_CREDENTIALS = '/Users/chengchinlim/BackendProjects/firebase-cloud-messaging-service-account-key.json'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://cloudmessaging-5227.firebaseio.com"
  });

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const pushEveryMinute = functions.pubsub.topic('cron-topic')
    .onPublish(async message => {
        const now = new Date(Date.now())
        console.log(`Time now is ${now}`)   
        console.log(`Message: ${JSON.stringify(message)}`)

        const payload = {
            notification: {
                title: 'From firebase function',
                body: 'Hi! Cheng is here',
            }
        }
        const testToken = process.env.TEST_TOKEN
        let token: any
        if (testToken !== undefined) {
            token = testToken
            console.log(`Token: ${token}`)
        } else {
            return
        }
        return admin.messaging().sendToDevice(token, payload)
})
