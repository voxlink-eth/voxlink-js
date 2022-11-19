/*
    This library is used to link to the Voxlink onchain API.
    It is self contained and does not require any other libraries.
*/
if (typeof window === 'undefined') {
    var window = {};
    global.window = window;
}
(async () => {
    var internal = {
        removeElement: function (id) {
            if (id.indexOf("VoxlinkElement") == -1) {
                id = "VoxlinkElement-" + id;
            }
            var el = document.getElementById(id);
            if (el) {
                el.parentNode.removeChild(el);
            };
            Voxlink.activeModal = null;
            Voxlink.activeElement = null;
        },
        createToast: function (message, position, timeout) {
            var toast = document.createElement("div");
            // style the toast
            toast.style.position = "fixed";
            toast.style.zIndex = "500";
            // center the toast to the middle of the screen
            switch (position) {
                case "top-center":
                    toast.style.top = "50px";
                    toast.style.left = "50%";
                    toast.style.transform = "translate(-50%, 0)";
                    break;
                case "bottom-center":
                    toast.style.left = "50%";
                    toast.style.bottom = "50px";
                    toast.style.transform = "translate(-50%, 0)";
                    break;
                case "top-left":
                    toast.style.top = "50px";
                    toast.style.left = "50px";
                    break;
                case "bottom-left":
                    toast.style.bottom = "50px";
                    toast.style.left = "50px";
                    break;
                case "top-right":
                    toast.style.top = "50px";
                    toast.style.right = "50px";
                    break;
                case "bottom-right":
                    toast.style.bottom = "50px";
                    toast.style.right = "50px";
                    break;
                default:
                    if (!timeout) { timeout = position };
            }
            // make the toast animated, blur in
            toast.style.transition = "opacity 350ms ease, height 350ms ease 400ms";
            // white shadow all sides
            toast.style.boxShadow = "0 0 20px 0 rgba(0, 0, 0, 0.9)";

            toast.style.padding = "20px";
            toast.style.backgroundColor = "#1D2464";
            toast.style.color = "white";
            toast.style.borderRadius = "5px";

            toast.style.fontFamily = "Chillax-Regular";

            toast.className = "VoxlinkToast";
            toast.innerHTML = message;
            document.body.appendChild(toast);
            if (!timeout || isNaN(timeout)) {
                timeout = 5000;
            };
            setTimeout(function () {
                toast.parentNode.removeChild(toast);
            }, timeout);
        },
        createElement: function (elementId, id, title, content) {
            if (Voxlink.activeElement) {
                internal.removeElement(Voxlink.activeElement);
            }
            // create modal content
            var elementContent = document.createElement("div");
            //elementContent.style.position = "absolute";
            elementContent.style.fontFamily = "Chillax-Regular";
            elementContent.style.width = "100%";
            /*elementContent.style.top = "50%";
            elementContent.style.left = "50%";
            elementContent.style.transform = "translate(-50%, -50%)";*/
            elementContent.style.backgroundColor = "#1d2464";
            elementContent.style.padding = "20px";
            elementContent.style.borderRadius = "10px";
            /*elementContent.style.width = "650px";
            elementContent.style.maxWidth = "90vw";*/
            //elementContent.style.height = "auto";
            elementContent.style.fontSize = "1.4em";
            var elementTitle = document.createElement("h1");
            elementTitle.style.color = "#FFF";
            elementTitle.style.fontSize = "1.8em";
            elementTitle.style.fontWeight = "bold";
            elementTitle.style.marginBottom = "8px";
            elementTitle.style.fontFamily = "Chillax-Regular";
            elementTitle.style.borderBottom = "2px solid #3235ef"
            elementTitle.innerHTML = title;
            elementContent.appendChild(elementTitle);
            // create element description
            var elementDescription = document.createElement("p");
            elementDescription.style.color = "#FFF";
            elementDescription.innerHTML = content;
            elementContent.appendChild(elementDescription);
            // create unique identifier for element from title

            elementContent.id = "VoxlinkElement-" + id;
            elementContent.remove = function () {
                var thisElement = document.querySelector('#' + elementContent.id);
                thisElement.parentElement.removeChild(thisElement);
                Voxlink.activeElement = "";
            };
            // add modal to body
            // add content to provided element
            document.querySelector('#' + elementId).appendChild(elementContent);

            Voxlink.activeElement = elementContent.id;
            return elementContent;
        },
        createModal: function (id, title, content) {
            if (Voxlink.activeModal) {
                internal.removeElement(Voxlink.activeModal);
            }
            var modal = document.createElement("div");
            modal.style.fontFamily = "Chillax-Regular";
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0,0,0,0.7)";
            modal.style.zIndex = "5000";
            // create modal content
            var modalContent = document.createElement("div");
            modalContent.style.position = "absolute";
            modalContent.style.fontFamily = "Chillax-Regular";
            modalContent.style.top = "50%";
            modalContent.style.left = "50%";
            modalContent.style.transform = "translate(-50%, -50%)";
            modalContent.style.backgroundColor = "#1D2464";
            modalContent.style.padding = "20px";
            modalContent.style.borderRadius = "10px";
            modalContent.style.width = "650px";
            modalContent.style.maxWidth = "90vw";
            modalContent.style.height = "auto";
            modalContent.style.fontSize = "1.4em";
            // create modal title
            var modalTitle = document.createElement("h1");
            modalTitle.style.color = "#FFF";
            modalTitle.style.fontSize = "1.8em";
            modalTitle.style.fontWeight = "bold";
            modalTitle.style.marginBottom = "8px";
            modalTitle.style.fontFamily = "Chillax-Regular";
            modalTitle.style.borderBottom = "2px solid #3235ef";
            modalTitle.innerHTML = title;
            modalContent.appendChild(modalTitle);
            // create modal description
            var modalDescription = document.createElement("p");
            modalDescription.style.color = "#FFF";
            modalDescription.innerHTML = content;
            modalContent.appendChild(modalDescription);
            // add content to modal
            modal.appendChild(modalContent);
            // create unique identifier for modal from title

            modal.id = "VoxlinkElement-" + id;
            modal.remove = function () {
                var thisModal = document.querySelector('#' + modal.id);
                thisModal.parentElement.removeChild(thisModal);
                Voxlink.activeModal = "";
            };
            // add modal to body
            document.body.appendChild(modal);
            Voxlink.activeModal = modal.id;
            return modal;
        },
        ethereum: window?.ethereum
    };
    window.Voxlink = {
        activeModal: null,
        setWeb3Provider: function (provider) {
            if (!provider.request) {
                //provider = provider.currentProvider;
                provider.request = (c) => {
                    return new Promise((resolve, reject) => {
                        provider.send(c, function (err, res) {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(res.result);
                        });
                    });
                };
            }
            internal.ethereum = provider;
            window.Voxlink.web3request = internal.ethereum.request;
        },
        init: async function () {
            if (typeof (configVoxlink) !== "undefined" && configVoxlink.web3Provider) {
                Voxlink.setWeb3Provider(configVoxlink.web3Provider);
            }
            Voxlink.interceptor();
            Voxlink.initKeccak(Voxlink);
            Voxlink.VoxlinkMainNode = Voxlink.getNameHash(Voxlink.VoxlinkMainDomain); //"0x6afd9e9c9770c951012614a4b0237155806a4f897ba05dac300f7e6694aae017", //"0x23d962ed956faa47b43b7d38741047a33a659deb4ca69d29dd4ed8d1b5644fe5";
            Voxlink.VoxlinkTestNode = Voxlink.getNameHash(Voxlink.VoxlinkTestDomain);
            if (!Voxlink.VoxlinkContract) {
                Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
                // bug in metamask, need to ask for it a second time
                Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            };
            if (internal.ethereum?.on) {
                internal.ethereum.on("accountsChanged", (e) => Voxlink.events("accountsChanged", e));
                internal.ethereum.on("chainChanged", (e) => Voxlink.events("chainChanged", e));
                internal.ethereum.on('connect', (e) => Voxlink.events("connect", e));
                internal.ethereum.on('disconnect', (e) => Voxlink.events("disconnect", e));
                internal.ethereum.on('error', (e) => Voxlink.events("error", e));
                internal.ethereum.on('message', (e) => Voxlink.events("message", e));
            }
            if (!Voxlink.fontLoaded && typeof global == "undefined") {
                // add our font
                var font = new FontFace('Chillax-Regular', `url(data:application/font-woff2;base64,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) format("woff2")`);
                await font.load();
                document.fonts.add(font);
                Voxlink.fontLoaded = true;
            }
            // if we are not on voxlink.io, add a listener to the Voxlink accountsChanged event

            window.addEventListener('VoxlinkEvent', async function (e) {
                switch (e.detail.event) {
                    case 'accountsChanged':
                    case 'connect':
                        if (window.location.hostname !== 'voxlink.io') {
                            await Voxlink.checkForMainWallet();
                        }
                        break;
                    case 'message':
                        console.log(e);
                        break;
                    case 'error':
                        // if metamask error 4001, user rejected request

                        if (e.detail.data.code === 4001) {
                            // cancel the actual process
                            if (Voxlink.guidedProcess.status.activeProcess && Voxlink.guidedProcess.status.activeProcess != "") {
                                Voxlink[Voxlink.guidedProcess.status.activeProcess].cancel();
                            }
                            // show a toast
                            internal.createToast('<span style="font-size:1.5em">Action cancelled</span>', 'top-right', 5500);
                        }
                        break;
                }
            });

        },
        events: async function (event, data) {
            switch (event) {
                case "accountsChanged":
                    console.log("accountsChanged", data);
                    await Voxlink.disconnect();
                    await Voxlink.connect();
                    Voxlink.guidedProcess.reload();
                    break;
                case "chainChanged":
                    console.log("chainChanged", data);
                    await Voxlink.disconnect();
                    break;
                case "connect":
                    /*if (!Voxlink.connectedWallet && internal.ethereum.isConnected()) {
                        await Voxlink.connect();
                    }
                    console.log("connect", data);
                    Voxlink.ethereumConnected = true;*/
                    Voxlink.guidedProcess.reload();
                    break;
                case "disconnect":
                    console.log("disconnect", data);
                    Voxlink.ethereumConnected = false;
                    await Voxlink.disconnect();
                    break;
                case "error":
                    console.log("error", data);
                    Voxlink.ethereumConnected = false;
                    return Voxlink.error(data);
                    break;
                default:
                    console.log(data);
            }
            var VoxlinkEvent = new CustomEvent("VoxlinkEvent", { detail: { event: event, data: data } });
            window.dispatchEvent(VoxlinkEvent);
        },
        checkForMainWallet: async function () {
            if (Voxlink.connectedWallet) {
                // check if the connected wallet has burner wallets
                var { success, burnerWallets } = await Voxlink.getBurnerWalletsFromMainWallet(Voxlink.connectedWallet);
                if (burnerWallets.length > 0) {
                    // show a quick toast to let the user know they have burner wallets
                    internal.createToast('<span style="font-size:1.5em">Main Wallet detected</span><hr><br><span style="font-size:1.1em">You have connected a wallet that is using Voxlink.<br>Please consider connecting one of your burner wallets.<br><br>' + burnerWallets.join('<br>') + '</span>', 'top-left', 7500);
                }
            }
        },
        error: function (error) {
            var errorEvent = new CustomEvent("VoxlinkError", { detail: error });
            window.dispatchEvent(errorEvent);
        },
        ENSRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        VoxlinkMainNode: undefined,
        VoxlinkMainDomain: "voxlink.eth",
        VoxlinkTestNode: undefined,
        VoxlinkTestDomain: "newtest.eth",
        VoxlinkContract: "0x2ea85ea23903E7c9192c85adf59B9f877F4d29f8",
        connectedWallet: undefined,
        fontLoaded: false,
        functionsIntercepted: false,
        ethereumConnected: false,
        mode: "",
        zeroAddress: "0x0000000000000000000000000000000000000000",
        getVoxlinkContract: async function () {
            if (Voxlink.mode == "ENS") {
                // call the ENSRegistry to get the owner of the main node
                var nodeToUse = Voxlink.VoxlinkMainNode;
                // if we are on the test network, use the test node instead
                if (internal.ethereum?.networkVersion == "5") {
                    nodeToUse = Voxlink.VoxlinkTestNode;
                }
                var owner = await internal.ethereum.request({
                    method: 'eth_call',
                    jsonrpc: "2.0",
                    id: "1",
                    value: "0x0",
                    params: [{
                        to: Voxlink.ENSRegistry,
                        data: "0x02571be3" + nodeToUse.slice(2)
                    }, "latest"]
                });
                return "0x" + owner.slice(64 + 2 - 40);
            } else {
                switch (internal.ethereum?.chainId) {
                    case "0x1":
                        return "";
                        break;
                    case "0x5":
                        return "0x4A7b776E313240c292Bc5C03526f970E981d907A";
                        break;
                    default:
                        return Voxlink.VoxlinkContract;
                }
            }
        },
        setMode: async function (mode) {
            Voxlink.mode = mode;
            await Voxlink.init();
        },
        burnerWalletExists: async function (burnerWallet) {
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            var result = await internal.ethereum.request({
                method: 'eth_call',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: Voxlink.VoxlinkContract,
                    data: "0xbb10c61d" + Voxlink.padded(burnerWallet.slice(2))
                }, "latest"]
            });
            result = result.slice(2);
            // success is a boolean of the first 64 bytes
            var exists = Boolean(parseInt(result.substring(0, 64)));
            return exists;
        },
        getMainWalletFromBurnerWallet: async function (burnerWallet) {
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            try {
                var result = await internal.ethereum.request({
                    method: 'eth_call',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: Voxlink.VoxlinkContract,
                        data: "0xe702a670" + Voxlink.padded(burnerWallet.slice(2))
                    }, "latest"]
                });
            } catch (e) {
                window.dispatchEvent(new CustomEvent("VoxlinkError", { detail: e }));
                return { success: false, mainWallet: "", error: e };
            }
            result = result.slice(2);
            // success is a boolean of the first 64 bytes
            var success = Boolean(parseInt(result.substring(0, 64)));
            var mainWallet = result.substring(64 + 64 - 40, 128);
            return { success: success, mainWallet: Voxlink.toChecksumAddress("0x" + mainWallet) };
        },
        getBurnerWalletsFromMainWallet: async function (mainWallet) {
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            try {
                var result = await internal.ethereum.request({
                    method: 'eth_call',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: Voxlink.VoxlinkContract,
                        data: "0xc4f88ec4" + Voxlink.padded(mainWallet.slice(2))
                    }, "latest"]
                });
            } catch (e) {
                window.dispatchEvent(new CustomEvent("VoxlinkError", { detail: e }));
                return { success: false, burnerWallets: [], error: e };
            }
            result = result.slice(2);
            // success is a boolean of the first 64 bytes
            var success = Boolean(parseInt(result.substring(0, 64)));
            var burnerWallets = [];
            var burnerWalletsCount = parseInt(result.substring(64 + 64, 64 + 64 + 64));
            for (var i = 0; i < burnerWalletsCount; i++) {
                var burnerWallet = result.substring(64 + 64 + 64 + 24 + (i * 64), 64 + 64 + 64 + 24 + (i * 64) + 40);
                burnerWallets.push(Voxlink.toChecksumAddress("0x" + burnerWallet));
            }
            return { success: success, burnerWallets: burnerWallets };
        },
        registerVoxlink: async function (mainWallet, burnerWallet, safetyCode, mainWalletSignature, burnerWalletSignature) {
            //address mainWallet,
            //address burnerWallet,
            //uint256 safetyCode,
            //bytes memory mainWalletSignature,
            //bytes memory burnerWalletSignature
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            try {
                var result = await internal.ethereum.request({
                    method: 'eth_sendTransaction',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: Voxlink.VoxlinkContract,
                        from: burnerWallet,
                        data: "0xa7b42475" +
                            Voxlink.padded(mainWallet.slice(2)) +
                            Voxlink.padded(burnerWallet.slice(2)) +
                            Voxlink.padded(safetyCode.toString(16), 64) +
                            Voxlink.padded((64 + 64 + 32).toString(16), 64) +
                            Voxlink.padded((64 + 64 + 32 + 64 + 64).toString(16), 64) +
                            Voxlink.padded("41", 64) +
                            Voxlink.padded(mainWalletSignature.slice(2), 64, 'right') +
                            Voxlink.padded("41", 64) +
                            Voxlink.padded(burnerWalletSignature.slice(2), 64, 'right')
                    }]
                });
            } catch (e) {

                console.log(e);
            }
            return result;
        },
        deleteVoxlink: async function (burnerWallet) {
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            if (!Voxlink.connectedWallet) {
                await Voxlink.connect();
            }
            if (Voxlink.mode == "ENS") {
                var burnerWalletNode = Voxlink.getNameHash(burnerWallet.toLowerCase() + '.' + Voxlink.VoxlinkTestDomain);
                var result = await internal.ethereum.request({
                    method: 'eth_sendTransaction',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: Voxlink.ENSRegistry,
                        from: Voxlink.connectedWallet,
                        data: "0x5b0fc9c3" +
                            burnerWalletNode.slice(2) +
                            Voxlink.padded(Voxlink.zeroAddress.slice(2))
                    }]
                });
                return result;
            } else {
                try {
                    var result = await internal.ethereum.request({
                        method: 'eth_sendTransaction',
                        jsonrpc: "2.0",
                        id: "1",
                        params: [{
                            to: Voxlink.VoxlinkContract,
                            from: Voxlink.connectedWallet,
                            data: "0x199c9606" +
                                Voxlink.padded(burnerWallet.slice(2))
                        }]
                    });
                } catch (e) {
                    console.log(e);
                    var event = {};
                    event.event = "error";
                    event.data = e;
                    window.dispatchEvent(new CustomEvent('VoxlinkEvent', { detail: event }));
                }
                return result;
            }
        },
        deleteVoxlinks: async function (burnerWallets) {
            Voxlink.VoxlinkContract = await Voxlink.getVoxlinkContract();
            if (!Voxlink.connectedWallet) {
                await Voxlink.connect();
            }
            // ignore ENS mode
            var result = await internal.ethereum.request({
                method: 'eth_sendTransaction',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: Voxlink.VoxlinkContract,
                    from: Voxlink.connectedWallet,
                    data: "0x03337b3c" +
                        Voxlink.padded("20", 64) +
                        Voxlink.padded(burnerWallets.length.toString(16), 64, "left") +
                        burnerWallets.map(a => Voxlink.padded(a.slice(2))).join("")
                }]

                /*

                0x03337b3c
                0000000000000000000000000000000000000000000000000000000000000020
                0000000000000000000000000000000000000000000000000000000000000002
                000000000000000000000000a0fa92fa34107387dc85999a4d0021a43eae124c
                000000000000000000000000a0fa92fa34107387dc85999a4d0021a43eae124c
                    Voxlink.padded("40", 64) +
                    Voxlink.padded(((3 + ids1.length) * 32).toString(16), 64, "left") +
                    Voxlink.padded(ids1.length.toString(16), 64, "left") +
                    Voxlink.padded(account.slice(2)).repeat(ids1.length) +
                    Voxlink.padded(ids1.length.toString(16), 64, "left") +
                    Voxlink.padded(ids1.join(""), 64, "left")

                */
            });
            return result;
        },
        connect: async function () {
            if (!internal.ethereum) {
                // no provider detected, generate an error and display as 
                internal.createToast('<span style="font-size:1.5em">No ethereum wallet detected</span><hr><br><span style="font-size:1.1em">Please consider using a browser with a wallet extension (like MetaMask)</span>', 'top-right', 7500);
                throw ("No ethereum wallet detected");
                return;
            }
            try {
                var helper = Voxlink.toChecksumAddress((await internal.ethereum.request({ method: "eth_requestAccounts" }))[0]);
            } catch (e) {
                var event = {};
                event.event = "error";
                event.data = e;
                window.dispatchEvent(new CustomEvent('VoxlinkEvent', { detail: event }));
                throw ("Connection request rejected");
                return;
            }
            Voxlink._connectedWallet = helper;
            Voxlink.connectedWallet = helper;
            Voxlink.ethereumConnected = true;
            // save the network
            Voxlink.chainId = await internal.ethereum.request({ method: "eth_chainId" });
            if (Voxlink.chainId != "0x5") {
                internal.createToast('<span style="font-size:1.5em">As of now, Voxlink is available on the Goerli Testnet</span><hr><br><span style="font-size:1.1em">We are working on launching to main-net. Until then you can test out the features by switching the network in MetaMask to Goerli.</span>', 'top-left', 9000);
                Voxlink.disconnect();
                throw ("Wrong network");
            }
        },
        disconnect: async function () {
            Voxlink.connectedWallet = undefined;
            Voxlink.ethereumConnected = false;
        },
        toChecksumAddress: function (address) {
            address = address.toLowerCase().replace('0x', '')
            var hash = Voxlink.keccak256(address);
            var ret = '0x'
            for (var i = 0; i < address.length; i++) {
                if (parseInt(hash[i], 16) >= 8) {
                    ret += address[i].toUpperCase()
                } else {
                    ret += address[i]
                }
            }
            return ret;
        },
        resolveName: async function (name) {
            var node = Voxlink.getNameHash(name);
            var owner = await internal.ethereum.request({
                method: 'eth_call',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: Voxlink.ENSRegistry,
                    data: "0x02571be3" + node.slice(2)
                }, "latest"]
            });
            return Voxlink.toChecksumAddress("0x" + owner.slice(64 + 2 - 40));
        },
        getSafetyCode: async function (minutes) {
            if (!minutes) {
                minutes = 5;
            }
            var actualTimeStamp = parseInt((await internal.ethereum.request({
                method: "eth_getBlockByNumber", jsonrpc: "2.0",
                id: "1", params: ["latest", false]
            })).timestamp);
            return Math.floor(((actualTimeStamp * 1000) + minutes * 60 * 1000) / 1000);
            //return Math.floor((new Date().getTime() + minutes * 60 * 1000) / 1000);
        },
        getVoxlinkString: async function (mainWallet, burnerWallet, safetyCode) {
            return "voxlink.eth:\n\nmainWallet\n" + mainWallet.toLowerCase() + "\n\nburnerWallet\n" + burnerWallet.toLowerCase() +
                "\n\nsafetyCode\n" + safetyCode;
        },
        sign: async function (VoxlinkString) {
            var signature = await internal.ethereum.request({
                method: 'personal_sign',
                params: [VoxlinkString, Voxlink.connectedWallet]
            });
            return signature;
        },
        getNameHash: function (fullDomain) {
            if (fullDomain == '') {
                return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
            var fullDomainSplit = fullDomain.split('.');
            function _getNameHash(args) {
                if (typeof args !== 'object') {
                    args = [args];
                }
                var namehash = "0000000000000000000000000000000000000000000000000000000000000000";
                for (var i = args.length - 1; i >= 0; i--) {
                    var combined = namehash + Voxlink.keccak256(args[i]);
                    var bytes = [];
                    for (var n = 0; n < combined.length; n += 2) {
                        var code = parseInt(combined.substring(n, n+2), 16);
                        bytes.push(code);
                    }
                    namehash = Voxlink.keccak256(bytes);
                }
                return "0x" + namehash;
            }
            return _getNameHash(fullDomainSplit);
        },
        toHex: function (str) {
            return Array.from(str).map(el => el.charCodeAt(0)).map(el => el.toString(16)).join('');
        },
        // from hexstring to Uint8Array
        hexToUint8Array: function (hexstring) {
            var hexstring = hexstring.replace('0x', '');
            var arr = [];
            for (var i = 0; i < hexstring.length; i += 2) {
                arr.push(parseInt(hexstring.substring(i, 2), 16));
            }
            return new Uint8Array(arr);
        },
        padded: function (val, amount, side) {
            // pad val to multiple of 32 bytes
            var amount = amount || 32;
            var side = side || "left";
            var padded = val;
            while (padded.length % amount != 0) {
                if (side == "left") {
                    padded = "0" + padded;
                } else {
                    padded = padded + "0";
                }
            }
            return padded;
        },
        abi: {
            encodePacked: function (value) {
                switch (typeof (value)) {
                    case "number":
                        return '0x' + Voxlink.padded(value.toString(16), 64, "left");
                    case "string":
                        return '0x' + value.split('').map(el => el.charCodeAt(0).toString(16)).join('');
                }
            }
        },
        hasTokens: async function (collectionAddress, account) {
            return (await Voxlink.balanceOf(collectionAddress, account)) > 0;
        },
        balanceOf: async function (collectionAddress, account) {
            // check if the account has a burnerWallet
            var checkingAccount = account;
            if (await Voxlink.burnerWalletExists(checkingAccount)) {
                let { success, mainWallet } = await Voxlink.getMainWalletFromBurnerWallet(checkingAccount);
                if (success) {
                    checkingAccount = mainWallet;
                }
            }
            // TODO: check other interfaces

            // DETERMINE TYPE OF COLLECTION ERC721, ERC1155, ERC20
            // call supportInterface on the collectionAddress
            var erc721Interface = "0x80ac58cd";
            var erc1155Interface = "0xd9b67a26";
            var erc20Interface = "0x36372b07";
            var erc721 = Boolean(parseInt(await internal.ethereum.request({
                method: 'eth_call',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: collectionAddress,
                    data: "0x01ffc9a7" + erc721Interface.slice(2).padEnd(64, "0")
                }, "latest"]
            })));
            var erc1155 = Boolean(parseInt(await internal.ethereum.request({
                method: 'eth_call',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: collectionAddress,
                    data: "0x01ffc9a7" + erc1155Interface.slice(2).padEnd(64, "0")
                }, "latest"]
            })));
            var erc20 = Boolean(parseInt(await internal.ethereum.request({
                method: 'eth_call',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    to: collectionAddress,
                    data: "0x01ffc9a7" + erc20Interface.slice(2).padEnd(64, "0")
                }, "latest"]
            })));
            if (erc721 || erc20) {
                var result = await internal.ethereum.request({
                    method: 'eth_call',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: collectionAddress,
                        data: "0x70a08231" + Voxlink.padded(checkingAccount.slice(2))
                    }, "latest"]
                });
                return (parseInt(result.slice(2), 16));
            } else if (erc1155) {
                // in the case of erc1155, we need to check past logs for the account and get the ids
                var topicSig1 = "TransferSingle(address,address,address,uint256,uint256)";
                var topicSig2 = "TransferBatch(address,address,address,uint256[],uint256[])";
                var logs1 = await Voxlink.getLogs(collectionAddress, topicSig1, null, null, account);
                var logs2 = await Voxlink.getLogs(collectionAddress, topicSig2, null, null, account);
                // get the transferred ids
                var ids1 = logs1.map(log => log.data.substring(2, 66));

                var pre_ids2 = logs2.map(log => log.data.substring(2, 66));
                // get the lengths of the id array
                var len2 = pre_ids2[2];
                // get the ids
                var ids2 = [];
                for (var i = 3; i < 3 + len2; i++) {
                    ids2.push(pre_ids2[i]);
                }
                // add id2 to ids1
                ids1 = ids1.concat(ids2);
                // remove duplicates from ids1
                ids1 = ids1.filter((id, index) => ids1.indexOf(id) === index);
                console.log(ids1);
                // we call balanceOfBatch with all the ids to see if any of them are > 0
                var result = await internal.ethereum.request({
                    method: 'eth_call',
                    jsonrpc: "2.0",
                    id: "1",
                    params: [{
                        to: collectionAddress,
                        data: "0x4e1273f4" +
                            Voxlink.padded("40", 64) +
                            Voxlink.padded(((3 + ids1.length) * 32).toString(16), 64, "left") +
                            Voxlink.padded(ids1.length.toString(16), 64, "left") +
                            Voxlink.padded(account.slice(2)).repeat(ids1.length) +
                            Voxlink.padded(ids1.length.toString(16), 64, "left") +
                            Voxlink.padded(ids1.join(""), 64, "left")
                    }, "latest"]
                });
                result = result.slice(2);
                var resultingAmount = 0;
                for (var i = 1; i < result.length / 64; i++) {
                    resultingAmount += parseInt("0x" + result.substring(i * 64, (i + 1) * 64));
                }
                return resultingAmount;
            }
        },
        getLogs: async function (collectionAddress, signature) {
            var topics = [];
            topics.push("0x" + Voxlink.keccak256(signature));
            for (var i = 0; i < arguments.length - 2; i++) {
                if ((arguments[i + 2] == null) || (arguments[i + 2].trim() == "")) {
                    topics.push(null);
                } else {
                    topics.push("0x" + Voxlink.padded(arguments[i + 2].slice(2)));
                }
            };
            return await internal.ethereum.request({
                method: 'eth_getLogs',
                jsonrpc: "2.0",
                id: "1",
                params: [{
                    fromBlock: "0x0",
                    toBlock: "latest",
                    address: collectionAddress,
                    topics: topics
                }]
            });
        },
        ghostminting: {
            cancel: function () {
                // cancel minting by sending an event
                window.dispatchEvent(new CustomEvent('voxlink-ghostminting-cancel'));
            },
            switchToBurner: function () {
                // cancel minting by sending an event
                window.dispatchEvent(new CustomEvent('voxlink-ghostminting-switchtoburner'));
            },
            pauseCountdown: function () {
                // cancel minting by sending an event
                window.dispatchEvent(new CustomEvent('voxlink-ghostminting-pausecountdown'));
            },
            mint: function () {
                // cancel minting by sending an event
                window.dispatchEvent(new CustomEvent('voxlink-ghostminting-mint'));
            },
            start: async function (options) {
                options = options || {};
                return new Promise(async (resolve, reject) => {
                    // automatic process with user interaction
                    try {
                        await Voxlink.connect();
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    await Voxlink.checkForMainWallet();
                    var account = (await internal.ethereum.request({ method: 'eth_requestAccounts' }))[0];
                    // check if this account has a valid voxlink
                    var { success, mainWallet } = await Voxlink.getMainWalletFromBurnerWallet(account);
                    if (success) {
                        var shortenedWallet = mainWallet.substring(0, 6) + "..." + mainWallet.substring(mainWallet.length - 4, mainWallet.length);
                        var content = "You have connected a Voxlink burner wallet.<br>Your main wallet has automatically been detected. The NFT will be sent to your main wallet: <a title='" + mainWallet + "' href='https://goerli.etherscan.io/address/" + mainWallet + "' target='_blank'>" + shortenedWallet + "</a><br>";
                        content += "<span id='VoxlinkGhostmintingCountdown'>&nbsp;</span><br><br>";
                        content += '<button onclick="Voxlink.ghostminting.mint()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Mint now</button>';
                        content += '<button onclick="Voxlink.ghostminting.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                        content += '<button onclick="Voxlink.ghostminting.switchToBurner()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;">Send to burner</button>';
                        var newElement;
                        if (options.elementId) {
                            // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                            newElement = internal.createElement(options.elementId, "ghostminting", "GhostMinting by Voxlink", content);
                        } else {
                            newElement = internal.createModal('ghostminting', 'GhostMinting by Voxlink', content);
                        }
                        // countdown
                        /*var count = options.countDown || 8;
                        var countdown = setInterval(function () {
                            newElement.querySelector("#VoxlinkGhostmintingCountdown").innerHTML = "Minting in " + count + " seconds... <button href='#' style='text-decoration:underline' onclick='Voxlink.ghostminting.pauseCountdown()'>pause</button>";
                            if (count == 0) {
                                Voxlink.ghostminting.mint();
                            }
                            count--;
                        }, 1200);*/
                        // listen to cancel event
                        window.addEventListener("voxlink-ghostminting-cancel", function () {
                            //clearInterval(countdown);
                            internal.removeElement("ghostminting");
                            resolve({ success: false, mainWallet: undefined });
                        }, { once: true });
                        window.addEventListener("voxlink-ghostminting-switchtoburner", function () {
                            //clearInterval(countdown);
                            internal.removeElement("ghostminting");
                            resolve({ success: true, mainWallet: account });
                        }, { once: true });
                        window.addEventListener("voxlink-ghostminting-pausecountdown", function () {
                            //clearInterval(countdown);
                        }, { once: true });
                        window.addEventListener("voxlink-ghostminting-mint", function () {
                            //clearInterval(countdown);
                            internal.removeElement("ghostminting");
                            resolve({ success: true, mainWallet: mainWallet });
                        }, { once: true });

                    } else {
                        // no valid voxlink detected
                        resolve({ success: true, mainWallet: account });
                    }
                });
            }
        },
        guidedProcess: {
            status: {
                activeProcess: ""
            },
            reload: function () {
                // reload the last used process
                if (Voxlink.guidedProcess.status.activeProcess != "") {
                    Voxlink[Voxlink.guidedProcess.status.activeProcess].start();
                }
            }
        },
        delete: {
            status: {},
            start: async function (options) {
                Voxlink.guidedProcess.status.activeProcess = "delete";
                internal.data = internal.data || {};
                internal.data.delete = internal.data.delete || {};
                internal.data.delete.options = internal.data.delete.options || options || {};
                options = internal.data.delete.options || options || {};
                Voxlink.delete.status = Voxlink.delete.status || {};
                if (!Voxlink.connectedWallet) {
                    try {
                        await Voxlink.connect();
                    } catch (e) {
                        return;
                    }
                }
                var { success, mainWallet } = await Voxlink.getMainWalletFromBurnerWallet(Voxlink.connectedWallet);
                if (!success) {
                    return Voxlink.register.start(options);
                }
                // delete Voxlink, managed process
                var modalTitle = "Manage your Voxlink";
                var modalDescription = "The connected wallet " + Voxlink.connectedWallet + " seems to already be a Voxlink burner wallet.<br><br>";
                modalDescription += "You can delete your Voxlink and remove the connection to your main wallet " + mainWallet + ".<br><br>If you want to create a new Voxlink, please connect with another burner wallet.<br><br>";
                modalDescription += "If you want to delete your Voxlink, please click on the button below.<br><br>";
                modalDescription += "<button onclick='Voxlink.delete.step(1)' style='font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;'>Delete Voxlink</button>";
                if (!internal.data.delete.options.elementId) {
                    // only add cancel if we are in a popup
                    modalDescription += '<button onclick="Voxlink.delete.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                }
                if (internal.data.delete.options.elementId) {
                    // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                    newElement = internal.createElement(internal.data.delete.options.elementId, "deleteVoxlink", modalTitle, modalDescription);
                } else {
                    newElement = internal.createModal('deleteVoxlink', modalTitle, modalDescription);
                }
                // save height of element to storage
                internal.data.delete.height = document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).offsetHeight;
                window.addEventListener("voxlink-delete-cancel", function () {
                    internal.removeElement("deleteVoxlink");
                }, { once: true });
            },
            cancel: function () {
                // cancel the process
                window.dispatchEvent(new CustomEvent('voxlink-delete-cancel'));
                Voxlink.guidedProcess.status.activeProcess = "";
            },
            step: async function (step) {
                switch (step) {
                    case 1:
                        // delete
                        try {
                            var r = await Voxlink.deleteVoxlink(Voxlink.connectedWallet);
                            if (r) {
                                Voxlink.delete.cancel();
                                internal.createToast('<span style="font-size:1.5em">Voxlink deleted! Please wait for the transaction confirmation.</span>', 'top-left', 5500);
                            }
                        } catch (e) {
                            var event = {};
                            event.event = "error";
                            event.data = e;
                            window.dispatchEvent(new CustomEvent('VoxlinkEvent', { detail: event }));
                        }
                        break;
                    default:
                        return;
                }
            }
        },
        multiDelete: {
            status: {},
            start: async function (options) {
                Voxlink.guidedProcess.status.activeProcess = "multiDelete";
                internal.data = internal.data || {};
                internal.data.multiDelete = internal.data.multiDelete || {};
                internal.data.multiDelete.options = internal.data.multiDelete.options || options || {};
                options = internal.data.multiDelete.options || options || {};
                Voxlink.multiDelete.status = Voxlink.multiDelete.status || {};
                if (!Voxlink.connectedWallet) {
                    try {
                        await Voxlink.connect();
                    } catch (e) {
                        return;
                    }
                }
                var { success, burnerWallets } = await Voxlink.getBurnerWalletsFromMainWallet(Voxlink.connectedWallet);
                if (!success) {
                    return Voxlink.register.start(options);
                }
                if (success && burnerWallets.length > 0) {
                    internal.data.multiDelete.burnerWallets = burnerWallets;
                    // multiple burner wallets detected
                    var modalTitle = "Manage your Voxlink(s)";
                    var modalDescription = "The connected wallet " + Voxlink.connectedWallet + " is linked to at least one Voxlink burner wallet.<br><br>";
                    modalDescription += "You can delete your Voxlinks and remove the connection to your main wallet.<br><br>";
                    modalDescription += "Just select the checkbox and click on the button below.<br>";
                    burnerWallets.forEach(function (burnerWallet, index) {
                        modalDescription += "<div style='display:flex;align-items:center;'><input class='VoxlinkBurnerWalletToDelete' type='checkbox' id='VoxlinkBurnerWalletToDelete-" + index + "' style='margin-right:10px;'><label for='VoxlinkBurnerWalletToDelete-" + index + "'>" + burnerWallet + "</label></div>";
                    });
                    modalDescription += "<br><br><button onclick='Voxlink.multiDelete.step(1)' style='font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;'>Delete Voxlinks</button>";
                    if (!internal.data.multiDelete.options.elementId) {
                        // only add cancel if we are in a popup
                        modalDescription += '<button onclick="Voxlink.multiDelete.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                    }
                    if (internal.data.multiDelete.options.elementId) {
                        // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                        newElement = internal.createElement(internal.data.multiDelete.options.elementId, "multiDeleteVoxlinks", modalTitle, modalDescription);
                    } else {
                        newElement = internal.createModal('multiDeleteVoxlinks', modalTitle, modalDescription);
                    }
                    // save height of element to storage
                    internal.data.multiDelete.height = document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).offsetHeight;
                    window.addEventListener("voxlink-multi-delete-cancel", function () {
                        internal.removeElement("multiDeleteVoxlinks");
                    }, { once: true });
                }
            },
            cancel: function () {
                // cancel the process
                window.dispatchEvent(new CustomEvent('voxlink-multi-delete-cancel'));
                Voxlink.guidedProcess.status.activeProcess = "";
            },
            step: async function (step) {
                switch (step) {
                    case 1:
                        // delete
                        // get all checked burnerwallets
                        var toDelete = [];
                        internal.data.multiDelete.burnerWallets.forEach(function (burnerWallet, index) {
                            if (document.querySelector('#VoxlinkBurnerWalletToDelete-' + index).checked) {
                                toDelete.push(burnerWallet);
                            }
                        });
                        if (toDelete.length > 0) {
                            try {
                                var r = await Voxlink.deleteVoxlinks(toDelete);
                                if (r) {
                                    Voxlink.multiDelete.cancel();
                                    internal.createToast('<span style="font-size:1.5em">Voxlinks deleted! Please wait for the transaction confirmation.</span>', 'top-left', 5500);
                                }
                            } catch (e) {
                                var event = {};
                                event.event = "error";
                                event.data = e;
                                window.dispatchEvent(new CustomEvent('VoxlinkEvent', { detail: event }));
                            }
                        }
                        return;
                        break;
                    default:
                        return;
                }
            }

        },
        register: {
            status: {},
            restart: async function () {
                internal.data = internal.data || {};
                internal.data.register = internal.data.register || {};
                options = internal.data.register.options || {};
                //Voxlink.register.status.mainWallet = "";
                //Voxlink.register.status.burnerWallet = "";
                Voxlink.register.start(options);
            },
            start: async function (options) {
                Voxlink.guidedProcess.status.activeProcess = "register";
                internal.data = internal.data || {};
                internal.data.register = internal.data.register || {};
                internal.data.register.options = internal.data.register.options || options || {};
                options = internal.data.register.options || options || {};
                if (!Voxlink.connectedWallet) {
                    try {
                        var modalTitle = "Connecting your wallet...";
                        var modalDescription = "Please confirm the connection request in your wallet to continue.";
                        if (internal.data.register.options.elementId) {
                            // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                            newElement = internal.createElement(internal.data.register.options.elementId, "connectionRequestVoxlink", modalTitle, modalDescription);
                        } else {
                            newElement = internal.createModal('connectionRequestVoxlink', modalTitle, modalDescription);
                        }
                        await Voxlink.connect();
                    } catch (e) {
                        // send connection error event
                        var event = {};
                        event.event = "error";
                        event.data = e;
                        window.dispatchEvent(new CustomEvent('VoxlinkEvent', { detail: event }));
                        return;
                    }
                }
                if (await Voxlink.burnerWalletExists(Voxlink.connectedWallet)) {
                    return Voxlink.delete.start(options);
                }
                if ((await Voxlink.getBurnerWalletsFromMainWallet(Voxlink.connectedWallet)).burnerWallets.length > 0) {
                    return Voxlink.multiDelete.start(options);
                }

                return new Promise(async (resolve, reject) => {
                    Voxlink.register.status = Voxlink.register.status || {};
                    // register Voxlink, managed process
                    var modalTitle = "Create your Voxlink";
                    var modalDescription = "We will run you through the process of creating a Voxlink. This process will link a burner wallet to your main wallet. This will allow you to safely use your burner wallet, without having to connect your main wallet.<br><br>";
                    modalDescription += "<input list='modalVoxlinkRegisterWalletList' oninput='Voxlink.register.status.mainWallet = this.value' value='" + (Voxlink.register.status.mainWallet || "") + "'style='padding:2px;width:100%;color:#1d2464' type='text' id='modalVoxlinkRegisterMainWallet' placeholder='Enter the address of your main wallet (or ENS)'/><br>";
                    if (Voxlink.connectedWallet) {
                        modalDescription += '<datalist id="modalVoxlinkRegisterWalletList"><option>' + Voxlink.connectedWallet + '</option></datalist>';
                    }
                    modalDescription += "<span id='modalVoxlinkRegisterMainWallet_message'></span><br><br>";
                    modalDescription += "<input list='modalVoxlinkRegisterWalletList' oninput='Voxlink.register.status.burnerWallet = this.value' value='" + (Voxlink.register.status.burnerWallet || "") + "' style='padding:2px;width:100%;color:#1d2464' type='text' id='modalVoxlinkRegisterBurnerWallet' placeholder='Enter the address of your burner wallet (or ENS)'/><br>";
                    if (Voxlink.connectedWallet) {
                        modalDescription += '<datalist id="modalVoxlinkRegisterWalletList"><option>' + Voxlink.connectedWallet + '</option></datalist>';
                    }
                    modalDescription += "<span id='modalVoxlinkRegisterBurnerWallet_message'></span><br><br>";
                    if (Voxlink.register.status.burnerWallet || Voxlink.register.status.mainWallet) {
                        // show a button to clean
                        modalDescription += "<button onclick='Voxlink.register.restart()' style='font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;'>Reset</button>";
                    }
                    if (!internal.data.register.options.elementId) {
                        // only add cancel if we are in a popup
                        modalDescription += '<button onclick="Voxlink.register.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                    }
                    modalDescription += '<button onclick="Voxlink.register.step(2)" style="right:0px;font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;">Next</button>';
                    modalDescription += '<br><br><div style="text-align:center"><span style="font-size:2rem;color:#FFFFFF">&#9679;</span><span style="font-size:2rem;color:#FFFFFF">&#9675;</span><span style="font-size:2rem;color:#FFFFFF">&#9675;</span></div>';
                    var newElement;
                    if (internal.data.register.options.elementId) {
                        // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                        newElement = internal.createElement(internal.data.register.options.elementId, "registerVoxlink", modalTitle, modalDescription);
                    } else {
                        newElement = internal.createModal('registerVoxlink', modalTitle, modalDescription);
                    }
                    // save height of element to storage
                    internal.data.register.height = document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).offsetHeight;
                    window.addEventListener("voxlink-register-cancel", function () {
                        internal.removeElement("registerVoxlink");
                        resolve({ success: false });
                    }, { once: true });
                });
            },
            cancel: function () {
                window.dispatchEvent(new CustomEvent("voxlink-register-cancel"));
                Voxlink.guidedProcess.status.activeProcess = "";
            },
            step: async function (step) {
                switch (step) {
                    case 1:
                        // restart the process
                        Voxlink.register.start(internal.data.register.options);
                        break;
                    case 2:
                        // step 2
                        async function checkAndCorrect(addressName) {
                            var valid = true;
                            var regex = /^0x[a-fA-F0-9]{40}$/;
                            if (document.querySelector('#modalVoxlinkRegister' + addressName + '').value.indexOf('.eth') > -1) {
                                document.querySelector('#modalVoxlinkRegister' + addressName + '_message').innerHTML = 'Resolving .eth address...';
                                var result = await Voxlink.resolveName(document.querySelector('#modalVoxlinkRegister' + addressName + '').value);
                                if (result == Voxlink.zeroAddress) {
                                    document.querySelector('#modalVoxlinkRegister' + addressName + '_message').innerHTML = 'Could not resolve .eth address';
                                } else {
                                    document.querySelector('#modalVoxlinkRegister' + addressName + '_message').innerHTML = '';
                                    document.querySelector('#modalVoxlinkRegister' + addressName + '').value = result;
                                }
                            }
                            if (regex.test(document.querySelector('#modalVoxlinkRegister' + addressName).value)) {
                                document.querySelector('#modalVoxlinkRegister' + addressName).style.border = 'green 1px solid';
                                document.querySelector('#modalVoxlinkRegister' + addressName + '_message').innerHTML = "";
                            } else {
                                document.querySelector('#modalVoxlinkRegister' + addressName).style.border = 'red 1px solid';
                                document.querySelector('#modalVoxlinkRegister' + addressName + '_message').innerHTML = "Invalid address";
                                valid = false;
                            }
                            return valid;
                        }
                        var bothValid = await checkAndCorrect('MainWallet') & await checkAndCorrect('BurnerWallet');
                        Voxlink.register.status.mainWallet = document.getElementById("modalVoxlinkRegisterMainWallet").value;
                        Voxlink.register.status.burnerWallet = document.getElementById("modalVoxlinkRegisterBurnerWallet").value;
                        bothValid = bothValid & (Voxlink.register.status.mainWallet != Voxlink.register.status.burnerWallet);
                        // check if burner wallet is already in use
                        if (await Voxlink.burnerWalletExists(Voxlink.register.status.burnerWallet)) {
                            document.querySelector('#modalVoxlinkRegisterBurnerWallet_message').innerHTML = "This burner wallet is already in use <button onclick='Voxlink.delete.start()'>I want to delete it</button>";
                            bothValid = false;
                        }
                        if (bothValid) {
                            // both valid
                            Voxlink.register.step(3);
                        } else {
                            // not both valid
                            if (Voxlink.register.status.mainWallet == Voxlink.register.status.burnerWallet) {
                                document.querySelector('#modalVoxlinkRegisterMainWallet_message').innerHTML = "Main wallet and burner wallet cannot be the same";
                            }
                        }
                        break;
                    case 3:
                        // step 3
                        // avoid reloading during the wallet changes
                        Voxlink.guidedProcess.status.activeProcess = "";
                        var modalTitle = "Create your Voxlink";
                        var modalDescription = "Your main wallet address is: <span style='background:white;color:#1d2464'><strong><u>" + Voxlink.register.status.mainWallet + "</u></strong></span><br><br> ";
                        modalDescription += "Your burner wallet address is: <strong>" + Voxlink.register.status.burnerWallet + "</strong><br><br>";
                        modalDescription += "<span id='modalVoxlinkRegister_message'></span><br><br>";
                        if (!internal.data.register.options.elementId) {
                            // only add cancel if we are in a popup
                            modalDescription += '<button onclick="Voxlink.register.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                        } else {
                            modalDescription += '<button onclick="Voxlink.register.step(1)" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Back</button>';
                        }
                        modalDescription += '<button onclick="Voxlink.register.step(4)" style="right:0px;font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;">Connect main wallet and sign</button>';
                        modalDescription += '<br><br><div style="text-align:center"><span style="font-size:2rem;color:#FFFFFF">&#9675;</span><span style="font-size:2rem;color:#FFFFFF">&#9679;</span><span style="font-size:2rem;color:#FFFFFF">&#9675;</span></div>';
                        if (internal.data.register.options.elementId) {
                            // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                            internal.createElement(internal.data.register.options.elementId, "registerVoxlink", modalTitle, modalDescription);
                        } else {
                            internal.createModal('registerVoxlink', modalTitle, modalDescription);
                        }
                        // restore height of element to storage
                        document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).style.height = internal.data.register.height + "px";

                        document.querySelector('#modalVoxlinkRegister_message').innerHTML = "";
                        // check if connected wallet is main wallet
                        break;
                    case 4:
                        // step 4
                        await Voxlink.connect();
                        // check if connected wallet is main wallet
                        if (Voxlink.register.status.mainWallet.toLowerCase() == Voxlink.connectedWallet.toLowerCase()) {
                            // connected wallet is main wallet
                            Voxlink.register.status.safetyCode = Voxlink.register.status.safetyCode || await Voxlink.getSafetyCode();
                            var sigText = await Voxlink.getVoxlinkString(Voxlink.register.status.mainWallet, Voxlink.register.status.burnerWallet, Voxlink.register.status.safetyCode);
                            Voxlink.register.status.signatures = Voxlink.register.status.signatures || [];
                            Voxlink.register.status.signatures["main"] = await Voxlink.sign(sigText);
                            Voxlink.register.step(5);
                        } else {
                            // connected wallet is not main wallet
                            document.querySelector('#modalVoxlinkRegister_message').innerHTML = "Please connect the main wallet";
                        }
                        break;
                    case 5:
                        // step 5
                        var modalTitle = "Create your Voxlink";
                        var modalDescription = "Your main wallet address is: <strong>" + Voxlink.register.status.mainWallet + "</strong><br><br> ";
                        modalDescription += "Your burner wallet address is: <span style='background:white;color:#1d2464'><strong><u>" + Voxlink.register.status.burnerWallet + "</u></strong></span><br><br>";
                        modalDescription += "<span id='modalVoxlinkRegister_message'></span><br><br>";
                        if (!internal.data.register.options.elementId) {
                            // only add cancel if we are in a popup
                            modalDescription += '<button onclick="Voxlink.register.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Cancel</button>';
                        } else {
                            modalDescription += '<button onclick="Voxlink.register.step(1)" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Back</button>';
                        }
                        modalDescription += '<button onclick="Voxlink.register.step(6)" style="right:0px;font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;">Connect burner wallet and sign</button>';
                        modalDescription += '<br><br><div style="text-align:center"><span style="font-size:2rem;color:#FFFFFF">&#9675;</span><span style="font-size:2rem;color:#FFFFFF">&#9679;</span><span style="font-size:2rem;color:#FFFFFF">&#9675;</span></div>';
                        if (internal.data.register.options.elementId) {
                            // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                            internal.createElement(internal.data.register.options.elementId, "registerVoxlink", modalTitle, modalDescription);
                        } else {
                            internal.createModal('registerVoxlink', modalTitle, modalDescription);
                        }
                        // restore height of element to storage
                        document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).style.height = internal.data.register.height + "px";
                        break;
                    case 6:
                        // step 6
                        await Voxlink.connect();
                        // check if connected wallet is main wallet
                        if (Voxlink.register.status.burnerWallet.toLowerCase() == Voxlink.connectedWallet.toLowerCase()) {
                            // connected wallet is burner wallet
                            // connected wallet is main wallet
                            Voxlink.register.status.safetyCode = Voxlink.register.status.safetyCode || await Voxlink.getSafetyCode();
                            var sigText = await Voxlink.getVoxlinkString(Voxlink.register.status.mainWallet, Voxlink.register.status.burnerWallet, Voxlink.register.status.safetyCode);
                            Voxlink.register.status.signatures = Voxlink.register.status.signatures || [];
                            Voxlink.register.status.signatures["burner"] = await Voxlink.sign(sigText);
                            Voxlink.register.step(7);
                        } else {
                            // connected wallet is not main wallet
                            document.querySelector('#modalVoxlinkRegister_message').innerHTML = "Please connect the burner wallet";
                        }
                        break;
                    case 7:
                        // step 7
                        var modalTitle = "Creating your Voxlink...";
                        var modalDescription = "Your main wallet address is: <strong>" + Voxlink.register.status.mainWallet + "</strong><br><br> ";
                        modalDescription += "Your burner wallet address is: <strong>" + Voxlink.register.status.burnerWallet + "</strong><br><br>";
                        modalDescription += "<span id='modalVoxlinkRegister_message'></span><br><br>";
                        modalDescription += 'Please confirm the transaction in your wallet<br><br>';
                        modalDescription += '<button onclick="Voxlink.register.cancel()" style="font-size:1.25rem;padding-right:1rem;padding-left:1rem;font-weight:bold;border-radius:9999px;background:#3235ef;color:#FFFFFF;margin-right:10px;">Close</button>';
                        if (internal.data.register.options.elementId) {
                            // an elementId was provided, so we won't show the modal but instead inflate the code into the id
                            internal.createElement(internal.data.register.options.elementId, "registerVoxlink", modalTitle, modalDescription);
                        } else {
                            internal.createModal('registerVoxlink', modalTitle, modalDescription);
                        }
                        // restore height of element to storage
                        document.querySelector('#' + (Voxlink.activeElement || Voxlink.activeModal)).style.height = internal.data.register.height + "px";
                        try {
                            var r = await Voxlink.registerVoxlink(Voxlink.register.status.mainWallet, Voxlink.register.status.burnerWallet, Voxlink.register.status.safetyCode, Voxlink.register.status.signatures['main'], Voxlink.register.status.signatures['burner']);
                            if (r) {
                                Voxlink.register.cancel();
                                internal.createToast('<span style="font-size:1.5em">Voxlink created! Please wait for the transaction confirmation.</span>', 'top-left', 5500);
                            }
                        } catch (e) {
                            document.querySelector('#modalVoxlinkRegister_message').innerHTML = 'An error has occurred (' + e.message + ')';
                        }
                        break;
                }
            }
        },
        interceptor: function () {
            if (Voxlink.functionsIntercepted) {
                return;
            }
            Voxlink.functionsIntercepted = true;
            // get all functions in the Voxlink object and add an interceptor to each one, for catching errors
            var functions = Object.getOwnPropertyNames(Voxlink).filter(prop => typeof Voxlink[prop] == 'function');
            // for each function, add an interceptor add a try catch to the function
            for (var i = 0; i < functions.length; i++) {
                var func = functions[i];
                Voxlink.functionStorage[func] = Voxlink[func];
                if (["interceptor", "error", "init", "initKeccak"].indexOf(func) > -1) {
                    continue;
                }
                Voxlink[func] = new Function('try { return Voxlink.functionStorage["' + func + '"].apply(null,arguments); } catch (error) { Voxlink.error(error); }');
            }
        },
        // thx https://github.com/emn178/js-sha3
        initKeccak: function (root) {
            (function (root) {
                'use strict';
                var INPUT_ERROR = 'input is invalid type';
                var FINALIZE_ERROR = 'finalize already called';
                var WINDOW = typeof window === 'object';
                var WEB_WORKER = !WINDOW && typeof self === 'object';
                var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
                var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
                var AMD = typeof define === 'function' && define.amd;
                var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
                var HEX_CHARS = '0123456789abcdef'.split('');
                var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
                var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
                var KECCAK_PADDING = [1, 256, 65536, 16777216];
                var PADDING = [6, 1536, 393216, 100663296];
                var SHIFT = [0, 8, 16, 24];
                var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
                    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
                    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
                    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
                    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
                var BITS = [224, 256, 384, 512];
                var SHAKE_BITS = [128, 256];
                var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
                var CSHAKE_BYTEPAD = {
                    '128': 168,
                    '256': 136
                };

                if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
                    Array.isArray = function (obj) {
                        return Object.prototype.toString.call(obj) === '[object Array]';
                    };
                }

                if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
                    ArrayBuffer.isView = function (obj) {
                        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
                    };
                }

                var createOutputMethod = function (bits, padding, outputType) {
                    return function (message) {
                        return new Keccak(bits, padding, bits).update(message)[outputType]();
                    };
                };

                var createShakeOutputMethod = function (bits, padding, outputType) {
                    return function (message, outputBits) {
                        return new Keccak(bits, padding, outputBits).update(message)[outputType]();
                    };
                };

                var createCshakeOutputMethod = function (bits, padding, outputType) {
                    return function (message, outputBits, n, s) {
                        return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
                    };
                };

                var createKmacOutputMethod = function (bits, padding, outputType) {
                    return function (key, message, outputBits, s) {
                        return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
                    };
                };

                var createOutputMethods = function (method, createMethod, bits, padding) {
                    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
                        var type = OUTPUT_TYPES[i];
                        method[type] = createMethod(bits, padding, type);
                    }
                    return method;
                };

                var createMethod = function (bits, padding) {
                    var method = createOutputMethod(bits, padding, 'hex');
                    method.create = function () {
                        return new Keccak(bits, padding, bits);
                    };
                    method.update = function (message) {
                        return method.create().update(message);
                    };
                    return createOutputMethods(method, createOutputMethod, bits, padding);
                };

                var createShakeMethod = function (bits, padding) {
                    var method = createShakeOutputMethod(bits, padding, 'hex');
                    method.create = function (outputBits) {
                        return new Keccak(bits, padding, outputBits);
                    };
                    method.update = function (message, outputBits) {
                        return method.create(outputBits).update(message);
                    };
                    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
                };

                var createCshakeMethod = function (bits, padding) {
                    var w = CSHAKE_BYTEPAD[bits];
                    var method = createCshakeOutputMethod(bits, padding, 'hex');
                    method.create = function (outputBits, n, s) {
                        if (!n && !s) {
                            return methods['shake' + bits].create(outputBits);
                        } else {
                            return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
                        }
                    };
                    method.update = function (message, outputBits, n, s) {
                        return method.create(outputBits, n, s).update(message);
                    };
                    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
                };

                var createKmacMethod = function (bits, padding) {
                    var w = CSHAKE_BYTEPAD[bits];
                    var method = createKmacOutputMethod(bits, padding, 'hex');
                    method.create = function (key, outputBits, s) {
                        return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
                    };
                    method.update = function (key, message, outputBits, s) {
                        return method.create(key, outputBits, s).update(message);
                    };
                    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
                };

                var algorithms = [
                    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
                    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
                    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
                    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
                    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
                ];

                var methods = {}, methodNames = [];

                for (var i = 0; i < algorithms.length; ++i) {
                    var algorithm = algorithms[i];
                    var bits = algorithm.bits;
                    for (var j = 0; j < bits.length; ++j) {
                        var methodName = algorithm.name + '_' + bits[j];
                        methodNames.push(methodName);
                        methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
                        if (algorithm.name !== 'sha3') {
                            var newMethodName = algorithm.name + bits[j];
                            methodNames.push(newMethodName);
                            methods[newMethodName] = methods[methodName];
                        }
                    }
                }

                function Keccak(bits, padding, outputBits) {
                    this.blocks = [];
                    this.s = [];
                    this.padding = padding;
                    this.outputBits = outputBits;
                    this.reset = true;
                    this.finalized = false;
                    this.block = 0;
                    this.start = 0;
                    this.blockCount = (1600 - (bits << 1)) >> 5;
                    this.byteCount = this.blockCount << 2;
                    this.outputBlocks = outputBits >> 5;
                    this.extraBytes = (outputBits & 31) >> 3;

                    for (var i = 0; i < 50; ++i) {
                        this.s[i] = 0;
                    }
                }

                Keccak.prototype.update = function (message) {
                    if (this.finalized) {
                        throw new Error(FINALIZE_ERROR);
                    }
                    var notString, type = typeof message;
                    if (type !== 'string') {
                        if (type === 'object') {
                            if (message === null) {
                                throw new Error(INPUT_ERROR);
                            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                                message = new Uint8Array(message);
                            } else if (!Array.isArray(message)) {
                                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                                    throw new Error(INPUT_ERROR);
                                }
                            }
                        } else {
                            throw new Error(INPUT_ERROR);
                        }
                        notString = true;
                    }
                    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
                        blockCount = this.blockCount, index = 0, s = this.s, i, code;

                    while (index < length) {
                        if (this.reset) {
                            this.reset = false;
                            blocks[0] = this.block;
                            for (i = 1; i < blockCount + 1; ++i) {
                                blocks[i] = 0;
                            }
                        }
                        if (notString) {
                            for (i = this.start; index < length && i < byteCount; ++index) {
                                blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                            }
                        } else {
                            for (i = this.start; index < length && i < byteCount; ++index) {
                                code = message.charCodeAt(index);
                                if (code < 0x80) {
                                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                                } else if (code < 0x800) {
                                    blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                } else if (code < 0xd800 || code >= 0xe000) {
                                    blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                } else {
                                    code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                    blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                                }
                            }
                        }
                        this.lastByteIndex = i;
                        if (i >= byteCount) {
                            this.start = i - byteCount;
                            this.block = blocks[blockCount];
                            for (i = 0; i < blockCount; ++i) {
                                s[i] ^= blocks[i];
                            }
                            f(s);
                            this.reset = true;
                        } else {
                            this.start = i;
                        }
                    }
                    return this;
                };

                Keccak.prototype.encode = function (x, right) {
                    var o = x & 255, n = 1;
                    var bytes = [o];
                    x = x >> 8;
                    o = x & 255;
                    while (o > 0) {
                        bytes.unshift(o);
                        x = x >> 8;
                        o = x & 255;
                        ++n;
                    }
                    if (right) {
                        bytes.push(n);
                    } else {
                        bytes.unshift(n);
                    }
                    this.update(bytes);
                    return bytes.length;
                };

                Keccak.prototype.encodeString = function (str) {
                    var notString, type = typeof str;
                    if (type !== 'string') {
                        if (type === 'object') {
                            if (str === null) {
                                throw new Error(INPUT_ERROR);
                            } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
                                str = new Uint8Array(str);
                            } else if (!Array.isArray(str)) {
                                if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
                                    throw new Error(INPUT_ERROR);
                                }
                            }
                        } else {
                            throw new Error(INPUT_ERROR);
                        }
                        notString = true;
                    }
                    var bytes = 0, length = str.length;
                    if (notString) {
                        bytes = length;
                    } else {
                        for (var i = 0; i < str.length; ++i) {
                            var code = str.charCodeAt(i);
                            if (code < 0x80) {
                                bytes += 1;
                            } else if (code < 0x800) {
                                bytes += 2;
                            } else if (code < 0xd800 || code >= 0xe000) {
                                bytes += 3;
                            } else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
                                bytes += 4;
                            }
                        }
                    }
                    bytes += this.encode(bytes * 8);
                    this.update(str);
                    return bytes;
                };

                Keccak.prototype.bytepad = function (strs, w) {
                    var bytes = this.encode(w);
                    for (var i = 0; i < strs.length; ++i) {
                        bytes += this.encodeString(strs[i]);
                    }
                    var paddingBytes = w - bytes % w;
                    var zeros = [];
                    zeros.length = paddingBytes;
                    this.update(zeros);
                    return this;
                };

                Keccak.prototype.finalize = function () {
                    if (this.finalized) {
                        return;
                    }
                    this.finalized = true;
                    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
                    blocks[i >> 2] |= this.padding[i & 3];
                    if (this.lastByteIndex === this.byteCount) {
                        blocks[0] = blocks[blockCount];
                        for (i = 1; i < blockCount + 1; ++i) {
                            blocks[i] = 0;
                        }
                    }
                    blocks[blockCount - 1] |= 0x80000000;
                    for (i = 0; i < blockCount; ++i) {
                        s[i] ^= blocks[i];
                    }
                    f(s);
                };

                Keccak.prototype.toString = Keccak.prototype.hex = function () {
                    this.finalize();

                    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
                        extraBytes = this.extraBytes, i = 0, j = 0;
                    var hex = '', block;
                    while (j < outputBlocks) {
                        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                            block = s[i];
                            hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
                                HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
                                HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
                                HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
                        }
                        if (j % blockCount === 0) {
                            f(s);
                            i = 0;
                        }
                    }
                    if (extraBytes) {
                        block = s[i];
                        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
                        if (extraBytes > 1) {
                            hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
                        }
                        if (extraBytes > 2) {
                            hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
                        }
                    }
                    return hex;
                };

                Keccak.prototype.arrayBuffer = function () {
                    this.finalize();

                    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
                        extraBytes = this.extraBytes, i = 0, j = 0;
                    var bytes = this.outputBits >> 3;
                    var buffer;
                    if (extraBytes) {
                        buffer = new ArrayBuffer((outputBlocks + 1) << 2);
                    } else {
                        buffer = new ArrayBuffer(bytes);
                    }
                    var array = new Uint32Array(buffer);
                    while (j < outputBlocks) {
                        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                            array[j] = s[i];
                        }
                        if (j % blockCount === 0) {
                            f(s);
                        }
                    }
                    if (extraBytes) {
                        array[i] = s[i];
                        buffer = buffer.slice(0, bytes);
                    }
                    return buffer;
                };

                Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

                Keccak.prototype.digest = Keccak.prototype.array = function () {
                    this.finalize();

                    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
                        extraBytes = this.extraBytes, i = 0, j = 0;
                    var array = [], offset, block;
                    while (j < outputBlocks) {
                        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                            offset = j << 2;
                            block = s[i];
                            array[offset] = block & 0xFF;
                            array[offset + 1] = (block >> 8) & 0xFF;
                            array[offset + 2] = (block >> 16) & 0xFF;
                            array[offset + 3] = (block >> 24) & 0xFF;
                        }
                        if (j % blockCount === 0) {
                            f(s);
                        }
                    }
                    if (extraBytes) {
                        offset = j << 2;
                        block = s[i];
                        array[offset] = block & 0xFF;
                        if (extraBytes > 1) {
                            array[offset + 1] = (block >> 8) & 0xFF;
                        }
                        if (extraBytes > 2) {
                            array[offset + 2] = (block >> 16) & 0xFF;
                        }
                    }
                    return array;
                };

                function Kmac(bits, padding, outputBits) {
                    Keccak.call(this, bits, padding, outputBits);
                }

                Kmac.prototype = new Keccak();

                Kmac.prototype.finalize = function () {
                    this.encode(this.outputBits, true);
                    return Keccak.prototype.finalize.call(this);
                };

                var f = function (s) {
                    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
                        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
                        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
                        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
                    for (n = 0; n < 48; n += 2) {
                        c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
                        c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
                        c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
                        c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
                        c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
                        c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
                        c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
                        c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
                        c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
                        c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

                        h = c8 ^ ((c2 << 1) | (c3 >>> 31));
                        l = c9 ^ ((c3 << 1) | (c2 >>> 31));
                        s[0] ^= h;
                        s[1] ^= l;
                        s[10] ^= h;
                        s[11] ^= l;
                        s[20] ^= h;
                        s[21] ^= l;
                        s[30] ^= h;
                        s[31] ^= l;
                        s[40] ^= h;
                        s[41] ^= l;
                        h = c0 ^ ((c4 << 1) | (c5 >>> 31));
                        l = c1 ^ ((c5 << 1) | (c4 >>> 31));
                        s[2] ^= h;
                        s[3] ^= l;
                        s[12] ^= h;
                        s[13] ^= l;
                        s[22] ^= h;
                        s[23] ^= l;
                        s[32] ^= h;
                        s[33] ^= l;
                        s[42] ^= h;
                        s[43] ^= l;
                        h = c2 ^ ((c6 << 1) | (c7 >>> 31));
                        l = c3 ^ ((c7 << 1) | (c6 >>> 31));
                        s[4] ^= h;
                        s[5] ^= l;
                        s[14] ^= h;
                        s[15] ^= l;
                        s[24] ^= h;
                        s[25] ^= l;
                        s[34] ^= h;
                        s[35] ^= l;
                        s[44] ^= h;
                        s[45] ^= l;
                        h = c4 ^ ((c8 << 1) | (c9 >>> 31));
                        l = c5 ^ ((c9 << 1) | (c8 >>> 31));
                        s[6] ^= h;
                        s[7] ^= l;
                        s[16] ^= h;
                        s[17] ^= l;
                        s[26] ^= h;
                        s[27] ^= l;
                        s[36] ^= h;
                        s[37] ^= l;
                        s[46] ^= h;
                        s[47] ^= l;
                        h = c6 ^ ((c0 << 1) | (c1 >>> 31));
                        l = c7 ^ ((c1 << 1) | (c0 >>> 31));
                        s[8] ^= h;
                        s[9] ^= l;
                        s[18] ^= h;
                        s[19] ^= l;
                        s[28] ^= h;
                        s[29] ^= l;
                        s[38] ^= h;
                        s[39] ^= l;
                        s[48] ^= h;
                        s[49] ^= l;

                        b0 = s[0];
                        b1 = s[1];
                        b32 = (s[11] << 4) | (s[10] >>> 28);
                        b33 = (s[10] << 4) | (s[11] >>> 28);
                        b14 = (s[20] << 3) | (s[21] >>> 29);
                        b15 = (s[21] << 3) | (s[20] >>> 29);
                        b46 = (s[31] << 9) | (s[30] >>> 23);
                        b47 = (s[30] << 9) | (s[31] >>> 23);
                        b28 = (s[40] << 18) | (s[41] >>> 14);
                        b29 = (s[41] << 18) | (s[40] >>> 14);
                        b20 = (s[2] << 1) | (s[3] >>> 31);
                        b21 = (s[3] << 1) | (s[2] >>> 31);
                        b2 = (s[13] << 12) | (s[12] >>> 20);
                        b3 = (s[12] << 12) | (s[13] >>> 20);
                        b34 = (s[22] << 10) | (s[23] >>> 22);
                        b35 = (s[23] << 10) | (s[22] >>> 22);
                        b16 = (s[33] << 13) | (s[32] >>> 19);
                        b17 = (s[32] << 13) | (s[33] >>> 19);
                        b48 = (s[42] << 2) | (s[43] >>> 30);
                        b49 = (s[43] << 2) | (s[42] >>> 30);
                        b40 = (s[5] << 30) | (s[4] >>> 2);
                        b41 = (s[4] << 30) | (s[5] >>> 2);
                        b22 = (s[14] << 6) | (s[15] >>> 26);
                        b23 = (s[15] << 6) | (s[14] >>> 26);
                        b4 = (s[25] << 11) | (s[24] >>> 21);
                        b5 = (s[24] << 11) | (s[25] >>> 21);
                        b36 = (s[34] << 15) | (s[35] >>> 17);
                        b37 = (s[35] << 15) | (s[34] >>> 17);
                        b18 = (s[45] << 29) | (s[44] >>> 3);
                        b19 = (s[44] << 29) | (s[45] >>> 3);
                        b10 = (s[6] << 28) | (s[7] >>> 4);
                        b11 = (s[7] << 28) | (s[6] >>> 4);
                        b42 = (s[17] << 23) | (s[16] >>> 9);
                        b43 = (s[16] << 23) | (s[17] >>> 9);
                        b24 = (s[26] << 25) | (s[27] >>> 7);
                        b25 = (s[27] << 25) | (s[26] >>> 7);
                        b6 = (s[36] << 21) | (s[37] >>> 11);
                        b7 = (s[37] << 21) | (s[36] >>> 11);
                        b38 = (s[47] << 24) | (s[46] >>> 8);
                        b39 = (s[46] << 24) | (s[47] >>> 8);
                        b30 = (s[8] << 27) | (s[9] >>> 5);
                        b31 = (s[9] << 27) | (s[8] >>> 5);
                        b12 = (s[18] << 20) | (s[19] >>> 12);
                        b13 = (s[19] << 20) | (s[18] >>> 12);
                        b44 = (s[29] << 7) | (s[28] >>> 25);
                        b45 = (s[28] << 7) | (s[29] >>> 25);
                        b26 = (s[38] << 8) | (s[39] >>> 24);
                        b27 = (s[39] << 8) | (s[38] >>> 24);
                        b8 = (s[48] << 14) | (s[49] >>> 18);
                        b9 = (s[49] << 14) | (s[48] >>> 18);

                        s[0] = b0 ^ (~b2 & b4);
                        s[1] = b1 ^ (~b3 & b5);
                        s[10] = b10 ^ (~b12 & b14);
                        s[11] = b11 ^ (~b13 & b15);
                        s[20] = b20 ^ (~b22 & b24);
                        s[21] = b21 ^ (~b23 & b25);
                        s[30] = b30 ^ (~b32 & b34);
                        s[31] = b31 ^ (~b33 & b35);
                        s[40] = b40 ^ (~b42 & b44);
                        s[41] = b41 ^ (~b43 & b45);
                        s[2] = b2 ^ (~b4 & b6);
                        s[3] = b3 ^ (~b5 & b7);
                        s[12] = b12 ^ (~b14 & b16);
                        s[13] = b13 ^ (~b15 & b17);
                        s[22] = b22 ^ (~b24 & b26);
                        s[23] = b23 ^ (~b25 & b27);
                        s[32] = b32 ^ (~b34 & b36);
                        s[33] = b33 ^ (~b35 & b37);
                        s[42] = b42 ^ (~b44 & b46);
                        s[43] = b43 ^ (~b45 & b47);
                        s[4] = b4 ^ (~b6 & b8);
                        s[5] = b5 ^ (~b7 & b9);
                        s[14] = b14 ^ (~b16 & b18);
                        s[15] = b15 ^ (~b17 & b19);
                        s[24] = b24 ^ (~b26 & b28);
                        s[25] = b25 ^ (~b27 & b29);
                        s[34] = b34 ^ (~b36 & b38);
                        s[35] = b35 ^ (~b37 & b39);
                        s[44] = b44 ^ (~b46 & b48);
                        s[45] = b45 ^ (~b47 & b49);
                        s[6] = b6 ^ (~b8 & b0);
                        s[7] = b7 ^ (~b9 & b1);
                        s[16] = b16 ^ (~b18 & b10);
                        s[17] = b17 ^ (~b19 & b11);
                        s[26] = b26 ^ (~b28 & b20);
                        s[27] = b27 ^ (~b29 & b21);
                        s[36] = b36 ^ (~b38 & b30);
                        s[37] = b37 ^ (~b39 & b31);
                        s[46] = b46 ^ (~b48 & b40);
                        s[47] = b47 ^ (~b49 & b41);
                        s[8] = b8 ^ (~b0 & b2);
                        s[9] = b9 ^ (~b1 & b3);
                        s[18] = b18 ^ (~b10 & b12);
                        s[19] = b19 ^ (~b11 & b13);
                        s[28] = b28 ^ (~b20 & b22);
                        s[29] = b29 ^ (~b21 & b23);
                        s[38] = b38 ^ (~b30 & b32);
                        s[39] = b39 ^ (~b31 & b33);
                        s[48] = b48 ^ (~b40 & b42);
                        s[49] = b49 ^ (~b41 & b43);

                        s[0] ^= RC[n];
                        s[1] ^= RC[n + 1];
                    }
                };
                for (i = 0; i < methodNames.length; ++i) {
                    root[methodNames[i]] = methods[methodNames[i]];
                }
                if (AMD) {
                    define(function () {
                        return methods;
                    });
                }

            })(root)
        },
        functionStorage: []
    };
    if (typeof global !== 'undefined') {
        class CustomEvent {
            constructor(name, detail) {
                this.name = name;
                this.detail = detail;
            }
        }
        global.CustomEvent = CustomEvent;
        window.dispatchEvent = function (event) {
            console.log(event.name, event.detail);
        };
        global.Voxlink = window.Voxlink;
    } else {
        await Voxlink.init();
    }
})();
