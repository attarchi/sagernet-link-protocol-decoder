"use strict";
var zlib = require('zlib');
const link = "sn://ssh?eNpjYGBgMDQy1zMAwo1iQE5Rfv4XRrCgsYnptpKMVIWC0qSczGSF7NSfIPGS1OIS3eLiDN2CovyKSt3yzBIgM7G4uDy_6AlQmgEAVTEXww";
console.log(`The test config is ${link}`);
const validate = (link) => link.indexOf("sn://") === 0;
if (!validate(link)) {
    throw new Error("Link is not valid");
}
// Decode the link
// https://github.com/SagerNet/SagerNet/blob/70e684bae81d4bb4203e860ab88c4319e88f944d/app/src/main/java/io/nekohasekai/sagernet/fmt/UniversalFmt.kt#L28
// fun parseUniversal(link: String): AbstractBean {
//     return if (link.contains("?")) {
//         val type = link.substringAfter("sn://").substringBefore("?")
//         ProxyEntity(type = TypeMap[type] ?: error("Type $type not found")).apply {
//             putByteArray(ZipUtil.unZlib(Base64Decoder.decode(link.substringAfter("?"))))
//         }.requireBean()
//     } else {
//         val type = link.substringAfter("sn://").substringBefore(":")
//         ProxyEntity(type = TypeMap[type] ?: error("Type $type not found")).apply {
//             putByteArray(Base64Decoder.decode(link.substringAfter(":").substringAfter(":")))
//         }.requireBean()
//     }
// }
const decodeBase64 = (value) => Buffer.from(value.replace(/\-/g, '+').replace(/\_/g, '/'), 'base64');
const parseUniversal = (link) => {
    if (link.indexOf("?") >= 0) {
        const linkType = link.split("sn://")[1].split("?")[0];
        const linkSettings = link.split("?")[1];
        const buffer = zlib.inflateSync(decodeBase64(linkSettings));
        return { linkType, buffer };
    }
    else {
        const linkType = link.split("sn://")[1].split(":")[0];
        const linkSettings = link.split(":")[2];
        const buffer = decodeBase64(linkSettings);
        return { linkType, buffer };
    }
};
const decodedLink = parseUniversal(link);
console.log(`Decoded Link, Type is: ${decodedLink.linkType}\nSetting is: ${decodedLink.buffer.toString()}`);
