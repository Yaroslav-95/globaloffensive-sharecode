# Counter Strike: Global Offensive ShareCode decoder

A ShareCode decoder for CS:GO match replay sharecodes. Based on joshuaferrara's node-csgo's sharecode decoder.

## Example usage

```javascript
const { ShareCode } = require('globaloffensive-sharecode');

const shareCode = new ShareCode('CSGO-vGqmL-vb2x2-nTQtU-e9dco-qWHzN');
const data = shareCode.decode();

console.log(data)

{ matchId: '3354591898827227340',
  outcomeId: '3354598500191961136',
  token: '7780' }
```

