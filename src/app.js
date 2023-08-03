const ID = '468497400005394432';
const DiscordRPC = require('discord-rpc');
const si = require('systeminformation');
const RPC = new DiscordRPC.Client({ transport: 'ipc'});

DiscordRPC.register(ID);

async function SystemInfoCPU() {
    await si.cpu()
    .then(data => 
    {
      a = data.brand.toString();
    })

    await si.graphics()
    .then(data => {
      b = data.controllers[1].model.toString();
    })
    
    await si.mem()
    .then(data => {
        c = data.used;
        d = data.total;
    })
  
  
    return [a, b, c, d];
  }
  
  async function setActivity() {
    var a = await SystemInfoCPU();

    if (!RPC) return;

    function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

    RPC.setActivity({
        details: "CPU: 12th " + a[0] + " | " + "GPU: " + a[1],
        state: "Memory: " + formatBytes(a[2]) + "/" + formatBytes(a[3]),
        startTimestamp: '',
        largeImageKey: `pc-icon`,
        largeImageText: `large`,
        smallImageKey: `pc-icon`,
        smallImageText: `small`,
        instance: false,
    })
}


RPC.on('ready', async () => {
    console.log("RPC Presence UP");
    setActivity();

    setInterval(() => {
        setActivity();
    }, 1000);
});

RPC.login({ clientId: ID});