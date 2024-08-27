import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { generateMnemonic } from "bip39";
import './EthWallet.css'; // Import the CSS file

function EthWallet() {
    const [mnemonic, setMnemonic] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    return (
        <div className="container">
            <h1 className="title">Ethereum Wallet Generator</h1>
            <div className="button-group">
                <button
                    className="button create-seed"
                    onClick={async () => {
                        const mn = await generateMnemonic();
                        setMnemonic(mn);
                        setAddresses([]);
                    }}
                >
                    Generate Seed Phrase
                </button>
                <button
                    className="button add-wallet"
                    onClick={async () => {
                        if (!mnemonic) return; // Avoid adding wallets if mnemonic is not set
                        const seed = await mnemonicToSeed(mnemonic);
                        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
                        const hdNode = HDNodeWallet.fromSeed(seed);
                        const child = hdNode.derivePath(derivationPath);
                        const privateKey = child.privateKey;
                        const wallet = new Wallet(privateKey);
                        setCurrentIndex(currentIndex + 1);
                        setAddresses([...addresses, wallet.address]);
                    }}
                >
                    Add Ethereum Wallet
                </button>
            </div>
            <div className="mnemonic-container">
                <h2 className="section-title">Seed Phrase</h2>
                <div className="mnemonic">{mnemonic || 'No seed phrase generated yet.'}</div>
            </div>
            <div className="addresses-container">
                <h2 className="section-title">Generated Addresses</h2>
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <div key={index} className="address-item">
                            {address}
                        </div>
                    ))
                ) : (
                    <div className="no-addresses">No addresses generated yet.</div>
                )}
            </div>
        </div>
    );
}

export default EthWallet;
