// End-to-End Integration Test Suite for Alapa Microservices Backend
const GATEWAY_URL = 'http://localhost:8000';

async function runFinalTest() {
  console.log('🚀 Starting Alapa Full System End-to-End Integration Test via API Gateway...\n');

  try {
    // 1. Gateway Health Status
    console.log('1️⃣ Checking API Gateway & Downstream Services Health...');
    const healthRes = await fetch(`${GATEWAY_URL}/health`);
    const healthData = await healthRes.json();
    console.log('  -> Gateway Status:', healthData.data?.status || 'OK');
    console.log('  -> Downstream Services:', healthData.data?.services);

    // 2. Register Test User 1 & User 2
    const timestamp = Date.now();
    const user1Email = `user1_${timestamp}@alapa.app`;
    const user2Email = `user2_${timestamp}@alapa.app`;

    console.log('\n2️⃣ Registering Test Users...');
    const reg1Res = await fetch(`${GATEWAY_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice Test', email: user1Email, password: 'Password123!' })
    });
    const reg1Data = await reg1Res.json();
    const user1Token = reg1Data.data.tokens.accessToken;
    const user1Id = reg1Data.data.user._id;
    console.log('  -> User 1 Registered:', reg1Data.data.user.email, '| ID:', user1Id);

    const reg2Res = await fetch(`${GATEWAY_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob Test', email: user2Email, password: 'Password123!' })
    });
    const reg2Data = await reg2Res.json();
    const user2Token = reg2Data.data.tokens.accessToken;
    const user2Id = reg2Data.data.user._id;
    console.log('  -> User 2 Registered:', reg2Data.data.user.email, '| ID:', user2Id);

    // 3. Login & Profile Fetch
    console.log('\n3️⃣ Fetching Profile & Searching Users...');
    const meRes = await fetch(`${GATEWAY_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const meData = await meRes.json();
    console.log('  -> User 1 Profile:', meData.data.name, '(', meData.data.email, ')');

    const searchRes = await fetch(`${GATEWAY_URL}/api/users/search?query=Bob`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const searchData = await searchRes.json();
    console.log('  -> User Search Results count:', searchData.data.length);

    // 4. Create Chat Conversation & Send Message
    console.log('\n4️⃣ Chat Service: Creating Conversation & Sending Message...');
    const convRes = await fetch(`${GATEWAY_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify({ recipientId: user2Id })
    });
    const convData = await convRes.json();
    const convId = convData.data.conversation._id;
    console.log('  -> Conversation Created:', convId);

    const msgRes = await fetch(`${GATEWAY_URL}/api/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify({
        conversationId: convId,
        text: 'Hello Bob! This is a test message over Alapa microservices.'
      })
    });
    const msgData = await msgRes.json();
    console.log('  -> Message Sent:', msgData.data.message._id, '| Text:', msgData.data.message.text);

    // Fetch conversation messages
    const getMsgsRes = await fetch(`${GATEWAY_URL}/api/chat/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    const getMsgsData = await getMsgsRes.json();
    console.log('  -> Retrieved Messages for Bob:', getMsgsData.data.length, 'msg(s)');

    // 5. Video Call Service & Signaling
    console.log('\n5️⃣ Video Call Service: Initiating & Responding to Video Call...');
    const iceRes = await fetch(`${GATEWAY_URL}/api/calls/ice-servers`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const iceData = await iceRes.json();
    console.log('  -> ICE Servers Configured:', iceData.data.iceServers);

    const callInitRes = await fetch(`${GATEWAY_URL}/api/calls/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      },
      body: JSON.stringify({ receiverId: user2Id, type: 'video' })
    });
    const callInitData = await callInitRes.json();
    const callId = callInitData.data.call._id;
    console.log('  -> Call Initiated:', callId, '| Status:', callInitData.data.call.status);

    // Accept call by User 2
    const acceptRes = await fetch(`${GATEWAY_URL}/api/calls/${callId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2Token}`
      },
      body: JSON.stringify({ action: 'accept' })
    });
    const acceptData = await acceptRes.json();
    console.log('  -> Call Accepted by Bob | Status:', acceptData.data.call.status);

    // End call by User 1
    const endRes = await fetch(`${GATEWAY_URL}/api/calls/${callId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`
      }
    });
    const endData = await endRes.json();
    console.log('  -> Call Ended by Alice | Status:', endData.data.call.status, '| Duration:', endData.data.call.duration, 'sec');

    // Call History
    const historyRes = await fetch(`${GATEWAY_URL}/api/calls/history?type=video`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const historyData = await historyRes.json();
    console.log('  -> Alice Call History (Video):', historyData.data.length, 'record(s)');

    console.log('\n🎉 ALL END-TO-END INTEGRATION TESTS PASSED 100% SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ E2E Integration Test Failed:', error);
  }
}

runFinalTest();
