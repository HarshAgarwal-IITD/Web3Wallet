import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { generateMnemonic } from "bip39";
import './SolanaWallet.css'; // Import the CSS file

function SolanaWallet() {
    const [mnemonic, setMnemonic] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    return (
        <div className="container">
            <h1 className="title">Solana Wallet Generator</h1>
            <div className="button-group">
                <button
                    className="button create-seed"
                    onClick={async function() {
                        const mn = await generateMnemonic();
                        setMnemonic(mn);
                        setPublicKeys([]);
                    }}
                >
                    Generate Seed Phrase
                </button>
                <button
                    className="button add-wallet"
                    onClick={function() {
                        if (!mnemonic) return; // Avoid adding wallets if mnemonic is not set
                        const seed = mnemonicToSeed(mnemonic);
                        const path = `m/44'/501'/${currentIndex}'/0'`;
                        const derivedSeed = derivePath(path, seed.toString("hex")).key;
                        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                        const keypair = Keypair.fromSecretKey(secret);
                        setCurrentIndex(currentIndex + 1);
                        setPublicKeys([...publicKeys, keypair.publicKey]);
                    }}
                >
                    Add Wallet
                </button>
            </div>
            <div className="mnemonic-container">
                <h2 className="section-title">Seed Phrase</h2>
                <div className="mnemonic">{mnemonic || 'No seed phrase generated yet.'}</div>
            </div>
            <div className="public-keys-container">
                <h2 className="section-title">Generated Public Keys</h2>
                {publicKeys.length > 0 ? (
                    publicKeys.map((key, index) => (
                        <div key={index} className="public-key-item">
                            {key.toBase58()}
                        </div>
                    ))
                ) : (
                    <div className="no-keys">No public keys generated yet.</div>
                )}
            </div>
        </div>
    );
}

export default SolanaWallet;
