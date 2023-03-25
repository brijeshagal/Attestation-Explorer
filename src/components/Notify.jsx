import React from 'react'

const Notify = () => {
  
const sendNotification = async (recipientAddress, body, cta, img) => {
  try {
      const apiResponse = await EpnsAPI.payloads.sendNotification({
          signer,
          type: 3, // target
          identityType: 2, // direct payload
          notification: {
              title: `[SDK-TEST] notification TITLE:`,
              body: `[sdk-test] notification BODY`
          },
          payload: {
              title: 'Event starting soon...',
              body: body,
              cta: cta,
              img: img,
          },
          recipients: `eip155:42:${recipientAddress}`, // recipient address
          channel: 'eip155:42:0xBE2d52e161553772D57801E0Dd0A321b3e8bE534', // your channel address
          env: 'staging'
      });

      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse.status);
  } catch (err) {
      console.error('Error: ', err);
  }
}
  return (
    <div className=''>Notify</div>
  )
}

export default Notify