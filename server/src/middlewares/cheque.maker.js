// const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Regions = require('../configs/regions.json');
const Cities = require('../configs/cities.json');
module.exports = async (o) => {
    // const productLink = 'https://sharqiy.uz';
    // const qrCodeData = await QRCode.toDataURL(productLink);
    const doc = new PDFDocument({
        size: 'A6', margins: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        }
    });
    doc.registerFont('sans', __dirname + '/../configs/open-sans.ttf');
    const c = '\n-------------------------------------\n'
    doc.pipe(fs.createWriteStream(path.join('public', 'cheques', o?.id + '.pdf')));

    doc.font('sans').fontSize(10).text(`ID: ${o?.id} | ${o?.date}${c}Mijoz: ${o?.name} | ${o?.phone}${c}Maxsulot: ${o?.title}${c}Miqdori: ${o?.count} ta bonus: +${o?.bonus} ta${c}Manzil: ${Regions?.find(e => e.id === o?.region)?.name} - ${Cities?.find(e => e.id === o?.city)?.name}${c}Izoh: ${o?.about}${c}Operator: ${o?.operator_phone} | ${o.operator_name}${c}Call markaz: +998339306464${c}Narxi: ${Number(o?.price).toLocaleString()} so'm | Dostavka: ${Number(o?.delivery_price).toLocaleString()} so'm${c}Umumiy: ${Number(o?.price + o?.delivery_price).toLocaleString()} so'm`);

    // doc.image(qrCodeData, { width: 100, height: 100, x: 200, y: 320 });
    doc.end();
}