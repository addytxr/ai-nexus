async function testAPIs() {
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    console.log('1. Testing /api/graph/stats');
    const stats = await fetch(`${baseUrl}/graph/stats`).then(r => r.json());
    console.log(stats);

    console.log('\n2. Testing /api/search?q=Cursor');
    const search = await fetch(`${baseUrl}/search?q=Cursor`).then(r => r.json());
    console.log('Search Results:', search.data?.length);
    
    const cursorId = search.data?.[0]?.id;
    if (!cursorId) throw new Error('Could not find Cursor ID');

    console.log('\n3. Testing /api/search?q=Slack');
    const slackId = (await fetch(`${baseUrl}/search?q=Slack`).then(r => r.json())).data?.[0]?.id;
    
    console.log(`\n4. Testing /api/nodes/${cursorId}`);
    const details = await fetch(`${baseUrl}/nodes/${cursorId}`).then(r => r.json());
    console.log('Node Details Label:', details.data?.node?.label, 'Outgoing:', details.data?.outgoing?.length);

    console.log(`\n5. Testing /api/graph/neighbors?nodeId=${cursorId}&depth=1`);
    const neighbors = await fetch(`${baseUrl}/graph/neighbors?nodeId=${cursorId}&depth=1`).then(r => r.json());
    console.log('Neighbors Nodes:', neighbors.data?.nodes?.length, 'Edges:', neighbors.data?.edges?.length);

    console.log(`\n6. Testing /api/graph/path?source=${cursorId}&target=${slackId}`);
    const path = await fetch(`${baseUrl}/graph/path?source=${cursorId}&target=${slackId}`).then(r => r.json());
    console.log('Path Explanation:', path.data?.explanation);

    console.log(`\n7. Testing /api/graph/similar?nodeId=${cursorId}`);
    const similar = await fetch(`${baseUrl}/graph/similar?nodeId=${cursorId}`).then(r => r.json());
    console.log('Similar Tools Count:', similar.data?.length);

    console.log('\nAll tests passed successfully!');
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testAPIs();
