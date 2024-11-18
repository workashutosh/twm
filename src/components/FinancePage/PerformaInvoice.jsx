import React from 'react'
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import IMAGES from '@images';
import {useEffect } from  'react'
import apiInstance from '@api/apiInstance';

function PerformaInvoice() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const invoiceNumber = query.get('invoiceNumber');
  const clientName = query.get('clientName');
  const companyName = query.get('companyName');
  const companyAddress = query.get('companyAddress');
  const companyGST = query.get('companyGST');
  const projectName = query.get('projectName');
  const towerName = query.get('towerName');
  const wingName = query.get('wingName');
  const flatNo = query.get('flatNo');
  const unitCost = query.get('unitCost');
  const brokeragePercent = query.get('brokeragePercent');
  const invoiceType = query.get('invoice_type');
  const invoiceRaiseDAte = query.get('invoiceRaiseDate');
  const cn_title_number = query.get('cn_title_number');
  const cn_title_email = query.get('cn_title_email');
  const user_id  = query.get('generatedBy')
  const currentDate = new Date().toISOString().split('T')[0]; // Gets current date in YYYY-MM-DD format
  const dateParts = currentDate.split('-'); // Splits the date string into parts
  
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  
  const formattedDate = `${year}_${month}_${day}`;

  const getFinancialYear = (inputDate) => {
    // Parse the input date
    const date = new Date(inputDate);
  
    // Check if the month is before April
    if (date.getMonth() < 3) {
      // If before April, consider the previous year as the start of the financial year
      return `/${date.getFullYear() - 1}-${date.getFullYear() % 100}`;
    } else {
      // If on or after April, consider the current year as the start of the financial year
      return `/${date.getFullYear()}-${(date.getFullYear() % 100) + 1}`;
    }
  };

  function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


  function calculatePercentage(percent, value) {
    // Calculate the percentage
    let result = (percent * value) / 100;
    
    // Round the result to two decimal places
    result = Math.floor((result + Number.EPSILON) * 100) / 100;
    
    return result;
  }

var Invoice_Type = "";

if(invoiceType == "performa"){
  var Invoice_Type = "PROFORMA"
} else if(invoiceType == "tax"){
  var Invoice_Type = "TAX"
} else {
  var Invoice_Type = "PROFORMA"
}

const totalInvoiceValue = Math.floor(calculatePercentage(brokeragePercent, unitCost));
const totalCostValue = totalInvoiceValue;
const finalInvoiceValue = Math.floor((calculatePercentage(9 , totalCostValue) + calculatePercentage(9 , totalCostValue) + totalCostValue));

function convertToIndianCurrency(num) {
  const single = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const formatTenth = (digit, prev) => {
     return 0 == digit ? "" : " " + (1 == digit ? double[prev] : tens[digit])
  };
  const formatOther = (digit, next, denom) => {
     return (0 != digit && 1 != next ? " " + single[digit] : "") + (0 != next || digit > 0 ? " " + denom : "")
  };
  let res = "";
  let index = 0;
  let digit = 0;
  let next = 0;
  let words = [];
  if (num += "", isNaN(parseInt(num))){
     res = "";
  }
  else if (parseInt(num) > 0 && num.length <= 10) {
     for (index = num.length - 1; index >= 0; index--) switch (digit = num[index] - 0, next = index > 0 ? num[index - 1] - 0 : 0, num.length - index - 1) {
        case 0:
           words.push(formatOther(digit, next, ""));
        break;
        case 1:
           words.push(formatTenth(digit, num[index + 1]));
           break;
        case 2:
           words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] && 0 != num[index + 2] ? " and" : "") : "");
           break;
        case 3:
           words.push(formatOther(digit, next, "Thousand"));
           break;
        case 4:
           words.push(formatTenth(digit, num[index + 1]));
           break;
        case 5:
           words.push(formatOther(digit, next, "Lakh"));
           break;
        case 6:
           words.push(formatTenth(digit, num[index + 1]));
           break;
        case 7:
           words.push(formatOther(digit, next, "Crore"));
           break;
        case 8:
           words.push(formatTenth(digit, num[index + 1]));
           break;
        case 9:
           words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] || 0 != num[index + 2] ? " and" : " Crore") : "")
     };
     res = words.reverse().join("")
  } else res = "";
  return res
};



/* useEffect(() => {
 const printAndDownloadPDF = async () => {    
    const element = document.querySelector('.performa_invoice'); 
    const opt = {      
        margin: [10, 10, 10, 10],  // Small margins to fit more content
        filename: 'download.pdf',      
        image: { type: 'jpeg', quality: 0.98 },      
        html2canvas: { scale: 2, useCORS: true },  // Adjust scale for better resolution
        jsPDF: { unit: 'pt', format: [1200, 900], orientation: 'portrait' }  // Custom size matching the width of your div
    };    

    // Add custom CSS for print styles if needed
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .performa_invoice {
                width: 1300px;  // Ensure this matches the width in your div's class
                height: 900px;
                overflow: visible;
                page-break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(style);

    html2pdf().from(element).set(opt).save();
};


  printAndDownloadPDF();
}, []); */


useEffect(() => {
  const printAndSendPDF = async () => {
    const element = document.querySelector('.performa_invoice'); 
    const opt = {      
      margin: [10, 10, 10, 10],  // Small margins to fit more content
      filename: 'download.pdf',      
      image: { type: 'jpeg', quality: 0.98 },      
      html2canvas: { scale: 2, useCORS: true },  // Adjust scale for better resolution
      jsPDF: { unit: 'pt', format: [1200, 900], orientation: 'portrait' }  // Custom size matching the width of your div
    };

    // Add custom CSS for print styles if needed
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .performa_invoice {
          width: 1300px;  // Ensure this matches the width in your div's class
          height: 900px;
          overflow: visible;
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);

    // Generate the PDF and convert it to a Blob
    const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

    // Create a FormData object to send the Blob
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, `invoice_${invoiceNumber}_user${user_id}_Date${formattedDate}.pdf`);

    // Send the Blob via POST request
    try {
      const response = await apiInstance('client/invoice_record/getRecord.php', 'POST', formData);
      const data = await response.data;
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  printAndSendPDF();
}, []);

    return (
      <>
        <div className='h-full  px-64 items-center justify-center text-center pt-1 pb-1 performa_invoice print:px-44  print:items-center print:justify-center print:text-center print:pt-1 print:pb-1 print:w-[1200px] print:mt-44 print:h-[100px]'>
         <div className=' fixed w-10 h-10 cursor-pointer mr-4 print:hidden right-0 bottom-4'>
         <a href={`https://wa.me/91${cn_title_number}`} target='_blank'><img src={IMAGES.Whatsapp} alt="whatsapp"  /></a>
         </div>
          <div className='border border-black h-full px-8 pb-5 flex items-center justify-center print:border print:border-black print:h-full print:px-8 print:pb-5 print:flex print:items-center print:justify-center'> 
           <div className='text-xl pt-1 text-center font-bold print:text-xl print:pt-1 print:text-center print:font-bold'>
              LIVNEST TECHNOLOGIES PRIVATE LIMITED  
              <div className='text-xs pt-1 font-bold print:text-xs print:pt-1 print:font-bold'>
               <p>CIN: U70200MH2018PTC307267</p>
             </div>
             <div className='text-xs  font-bold gap-2 flex flex-1  justify-center pt-3 print:text-xs print:font-bold print:gap-2 print:flex print:flex-1 print:justify-center print:pt-3'>
               <p>Contact No : 7506374734</p>
               <p>Email Id : info@livnest.com</p>
             </div>
           </div>
          </div>
   
          <div className='border border-black bg-[#dcd8c3] w-full font-bold text-xl print:border print:border-black print:bg-[#dcd8c3] print:w-full print:font-bold print:text-xl print:h-[50px] print:items'>
           <h1 className=' mt-2'>{Invoice_Type} INVOICE</h1>  
          </div>
   
           <div className='flex text-[12px] font-semibold border border-black pl-1 print:flex print:text-[15px] print:font-semibold print:border print:h-10 print:border-black print:pl-1'> 
              <p className=' text-left w-[70%] print:text-left print:w-[70%] print:mt-2'>INVOICE NO : {invoiceNumber + getFinancialYear(invoiceRaiseDAte)} </p>
              <p className=' text-right print:text-right print:mt-2'>INVOICE DATE: {convertDateFormat(currentDate)}</p>
           </div>
              
           <div className='bg-[#e4deec] border border-black h-14 text-[12px] pl-1 print:bg-[#e4deec] print:border print:border-black  print:pl-1 print:text-[18px] print:h-24'>
            <div className='text-[12px] font-semibold text-left flex flex-1 grid-cols-2  print:text-[15px] print:font-semibold print:text-left print:flex print:flex-1 print:grid-cols-2 print:mt-2'><p className='pr-2 w-[50%] print:pr-2 print:w-[50%]'>Construction Company Name :</p> <p className='	w-[50%] print:w-[50%]'>{companyName}</p></div>
            <div className='text-[12px] font-semibold text-left flex flex-1 grid-cols-2 print:text-[15px] print:font-semibold print:text-left print:flex print:flex-1 print:grid-cols-2 print:mt-2'><p className='pr-2 w-[50%]'>Address :</p> <p className='	w-[50%]'>{companyAddress}</p></div>
           </div>
   
           <div className='border border-black pl-1 print:border print:border-black print:pl-1 print:h-34'>
               <div className='text-[12px]  flex-1 flex gap-2 h-5 print:text-[16px] print:flex-1 print:flex print:gap-2 print:h-6'>
                 <div className='grid-cols-2 flex-1 flex gap-1 font-semibold font-xs w-[50%] print:grid-cols-2 print:flex-1 print:flex print:gap-1 print:font-semibold print:font-xs print:[50%]'>
                 <p className='w-[60%] text-left print:w-[60%] print:text-left'>*Channel Partner RERA No</p>
                 <p>: A51700015221</p>
                 </div>
                 <div className='grid-cols-2 flex-1 flex gap-1 font-semibold font-xs w-[50%] print:grid-cols-2 print:flex-1 print:flex print:gap-1 print:font-semibold print:font-xs print:[50%]'>
                 <p className='w-[60%] text-left print:w-[60%] print:text-left'>*Channel Partner Pan Number</p>
                 <p>: AADCL5662M</p>
                 </div>
               </div>
               <div className='text-[12px] grid-cols-2 flex-1 flex gap-2 h-5 print:text-[16px] print:grid-cols-2 print:flex-1 print:flex print:gap-2 print:h-5'>
                 <div className='grid-cols-2 w-full flex-1 flex gap-1 font-semibold font-xs  print:grid-cols-2 print:w-full print:flex-1 print:flex print:gap-1 print:font-semibold print:font-xs'>
                 <p className='w-[60%] text-left print:w-[60%] print:text-left'>*Channel Partner GST No.</p>
                 <p>: 27AADCL5662M1Z1</p>
                 </div>
                 <div className='grid-cols-2 w-full flex-1 flex gap-1 font-semibold font-xs print:grid-cols-2 print:w-full print:flex-1 print:flex print:gap-1 print:font-semibold print:font-xs'>  
                 <p className='w-[60%] text-left print:w-[60%] print:text-left'>* SAC/ HSN Code</p>
                 <p>: 997222</p>
                 </div>
               </div>
           
                 <div className='text-[12px] grid-cols-2 flex-1 flex gap-2 h-5 print:text-[16px] print:grid-cols-2 print:flex-1 print:flex print:gap-2 print:h-5'>
                   <div className='grid-cols-2 flex-1 flex gap-1 font-semibold font-xs w-[55%] print:grid-cols-2 print:flex-1 print:flex print:gap-1 print:font-semibold print:font-xs print:w-[55%]'>
                   <p className='w-[30%] text-left print:w-[30%] print:text-left'>*{companyName}</p>
                   <p>: 27AAFFD4236J1ZF</p>
                 </div>
             </div>
             <div className='text-[12px] font-semibold pr-0 text-left print:text-[16px] print:font-semibold print:pr-0 print:text-left flex flex-1 print:mt-2'>
                 (Building sales on a fee/commission basis or contract basis)
             </div>
             <div className='text-[12px] font-semibold pr-0 text-left flex flex-1 print:flex print:flex-1 print:text-[16px] print:font-semibold print:pr-0 print:text-left'>
                 <div className='flex flex-1 print:flex print:flex-1 print:mt-1'>
                 <p className=' font-bold print:font-bold'>*Place of flat sold</p> <p>(it should mention state where service is rendered)</p>
                 </div>
                 <div className='pr-12 print:pr-12'>
                   <p className='font-bold print:font-bold'>:Maharastra</p>
                 </div>
             </div>
           </div>
   
           <div className='border border-black print:border print:border-black print:text-[16px] print:h-64'>
             <div className='flex flex-1 print:flex print:flex-1 print:text-[16px]'>
               <div className='border border-black w-[10%] print:borderr print:border-black print:w-[10%] print:text-[16px]'> Sr. No</div>
               <div className='border border-black w-[60%] print:border print:border-black print:w-[60%] print:text-[16px]'> Particulars</div> 
   
               <div className='border border-black w-[15%] print:border print:border-black print:w-[15%] print:text-[16px]'> Tax rate</div>
               <div className='border border-black w-[20%] print:border print:border-black print:w-[20%] print:text-[16px]'>Amount</div>
             </div>
   
             <div className='flex  h-[186px] print:flex print:h-[202px] print:text-[16px]'>
               <div className='border border-black w-[10%] print:border print:border-black print:w-[10%]'> 1</div>
               <div className='border border-black w-[60%] text-left pl-1 text-[12px] print:border print:border-black print:text-[12px]'>
                 <p className='text-sm print:text-sm'>Description of service provided</p>
   
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Customer Name:-</p>
                   <p>{clientName}</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Project Name:-</p>
                   <p>{projectName}</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Tower:-</p>
                   <p>{towerName}</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Wing:-</p>
                   <p>{wingName + flatNo}</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Unit Cost:-</p>
                   <p>{unitCost}</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Brokerage % :-</p>
                   <p>{brokeragePercent}</p>
                 </div>
              
                
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p className=' font-bold w-[50%] print:font-bold print:w-[50%]'>Goods & Service tax(GST):-</p>
                   <p>( A+B =18%)</p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>
                   <p>A) Central Goods & Service tax(CGST):- </p>
                 </div>
                 <div className='flex flex-1 gap-2 print:flex print:flex-1 print:gap-2'>           
                   <p>B) State Goods & Service tax(SGST): - </p>
                 </div>
                 </div> 
   
               <div className='border border-black w-[15%] flex flex-col justify-end font-bold print:border print:border-black print:w-[15%] print:flex print:flex-col print:justify-end print:font-bold'>
                 <p>9%</p>
                 <p>9%</p>
               </div>
   
               <div className='border border-black w-[20%] flex flex-col justify-end print:border print:border-solid print:border-black print:font-semibold print:text-[14px]'>
              
              
               <div className='border border-solid border-black font-semibold text-[14px] print:border print:border-solid print:border-black print:font-semibold print:text-[14px]'>
               <p>{Math.floor(totalInvoiceValue)}</p>
               </div>
               <div className='border border-solid border-black font-semibold text-[14px] print:border print:border-solid print:border-black print:font-semibold print:text-[14px] '>
               <p className='mt-3 print:mt-3'>{Math.floor(calculatePercentage(9 , totalCostValue))}</p>  
               <p>{Math.floor(calculatePercentage(9 , totalCostValue))}</p>
               </div>
               </div>
             </div>
             
             <div className='flex flex-1 print:flex print:flex-1'>
               <div className='border border-black w-[10%] print:border print:border-black print:w-[10%]' > </div>
               <div className='border border-black w-[60%] text-left pl-2 font-bold print:border print:border-black print:w-[60%] print:text-left print:pl-2 print:font-bold'> Total</div> 
   
               <div className='border border-black w-[15%] print:border print:border-black print:w-[15%]'> </div>
               <div className='border border-black w-[20%] font-bold text-sm print:border print:border-black print:w-[20%] print:font-bold print:text-sm'>{ finalInvoiceValue}</div>
             </div>
   
   
           </div>


           <div className='flex flex-1 text-[14px] font-bold border border-black print:flex print:flex-1 print:border print:border-black print:h-10'>
             <p className='w-[20%] text-left print:w-[20%] print:text-left print:mt-2 print:text-[16px]'>*Amount in words:</p> 
             <p className='w-[70%] text-left print:w-[70%] print:text-left print:mt-2 print:text-[16px]'>{convertToIndianCurrency(Number(finalInvoiceValue))+ " Only"}</p>
           </div>
           <div className='border border-black print:border print:border-black print:h-64'>
             <p className='font-bold underline text-[13px] text-left pl-1 print:font-bold print:underline print:text-[16px] print:text-left print:pl-1'>Payment Details</p>
             <p className='font-bold text-[13px] text-left pl-1 print:font-bold print:text-[16px] print:text-left print:pl-1'>KINDLY ISSUE CHEQUE IN FAVOUR OF "Livnest Technologies Private Limited"</p>
   
             <div className=' flex flex-1 print:flex print:flex-1'> 
             <div className='mt-3 text-[13px] w-full max-w-screen-2xl	gap-0 print:mt-3 print:text-[13px] print:w-full print:max-w-screen-2xl print:gap-0'>
   
               <div className=' flex flex-1 border border-black w-[100%] text-left pl-1 print:flex print:flex-1 print:border print:border-black print:w-[100%] print:text-left print:pl-1 print:h-8'>
               <div className='w-[40%] border print:w-[40%] print:border print:mt-1 print:text-[13px]'> <p>Name of Account holder</p></div>
               <div className=' w-[60%] border pl-1 print:w-[60%] print:border print:pl-1 print:mt-1 print:text-[13px]'> <p>Livnest Technologies Private Limited</p></div>
               </div>
   
            <div className=' flex flex-1 border border-black  w-[100%] text-left pl-1 print:flex print:flex-1 print:border print:border-black print:w-[100%] print:text-left print:pl-1 print:h-8'>
               <div className='w-[40%] border text-left pl-1 print:w-[40%] print:text-left print:pl-1 '> <p className=' print:mt-1 print:text-[16px]'> Bank Name</p></div><div className=' w-[50%] border pl-1 print:w-[50%] print:border print:pl-1 '> <p className=' print:mt-1 print:text-[16px]'>YES Bank</p></div></div>
               <div className=' flex flex-1 border border-black  w-[100%] text-left pl-1 print:flex print:flex-1 print:border print:border-black print:w-[100%] print:text-left print:pl-1'><div className='w-[40%] border pl-1 '> <p className=' print:mt-1 print:text-[16px]'>IFSC Code</p></div><div className=' w-[50%] border pl-1 print:w-[50%] print:border print:pl-1 '> <p className=' print:mt-1 print:text-[16px]'>YESB0000551</p></div></div>
               <div className=' flex flex-1 border border-black  w-[100%] text-left pl-1 print:flex print:flex-1 print:border  print:border-black print:w-[100%] print:text-left print:pl-1'><div className='w-[40%] border pl-1 print:w-[40%] print:border print:pl-1 '><p className=' print:mt-1 print:text-[16px]'>Account No.</p></div><div className=' w-[50%] border pl-1 print:w-[50%] print:border print:pl-1'> <p className=' print:mt-1 print:text-[16px]'>055184600002891</p></div></div>
             </div>
   
             <div className='w-full mt-20 font-bold text-[12px] print:w-full print:mt-20 print:font-bold print:text-[16px]'><p>(Stamp and signature of channel partner) </p> <p className=' justify-center print:justify-center'>Authorised Signatory</p></div>
             </div>
             <div className=' text-center border border-black text-[14px] mt-2 font-bold print:text-center print:text-[16px] print:h-[29px] print:mt-10 print:font-bold'><p>REG. OFFICE: FLAT NO. 102, BHAKTI PEARL A MOGHARPADA G B ROAD MUMBAI 400615</p></div>
           </div>
           
   
       </div>
       </>
     )
}

export default PerformaInvoice