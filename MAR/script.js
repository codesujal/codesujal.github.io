async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  
    const getInput = id => document.getElementById(id).value;
  
    const data = {
      serial: getInput('serial'),
      activity: getInput('activity'),
      activityDate: getInput('activityDate'),
      points: getInput('points'),
      studentName: getInput('studentName'),
      roll: getInput('roll'),
      dept: getInput('dept'),
      year: getInput('year'),
      semester: getInput('semester'),
      links: getInput('links'),
      currentDate: formatDate(new Date())
    };
  
    const x = 60;
    let y = 80;
    const lineHeight = 22;
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  
    // Text content
    const lines = [
      `Activity Serial Number: ${data.serial}`,
      `Activity Name: ${data.activity}`,
      `Date of Activity: ${data.activityDate}`,
      `Activity Point: ${data.points}`,
      `Student Name: ${data.studentName}`,
      `University Roll Number: ${data.roll}`,
      `Department: ${data.dept}`,
      `Year: ${data.year}`,
      `Semester: ${data.semester}`
    ];
  
    lines.forEach(line => {
      doc.text(line, x, y);
      y += lineHeight;
    });
  
    // Always show "Links (if any):"
    if (data.links.trim() !== '') {
      doc.setTextColor(0, 0, 200);
      doc.textWithLink(`Links (if any): ${data.links}`, x, y, { url: data.links });
      doc.setTextColor(0, 0, 0);
    } else {
      doc.text(`Links (if any):`, x, y);
    }
    y += lineHeight;
  
    // Certificate image
    const certImageInput = document.getElementById('bgImage').files[0];
    if (certImageInput) {
      const certImageData = await toBase64(certImageInput);
      const imgWidth = 200;
      const imgHeight = 250;
      doc.addImage(certImageData, 'PNG', x, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }
  
    // Signature image
    const signInput = document.getElementById('signatureImage').files[0];
    if (signInput) {
      const signData = await toBase64(signInput);
      const signWidth = 80;
      const signHeight = 40;
      doc.addImage(signData, 'PNG', x, y, signWidth, signHeight);
      y += signHeight + 5;
      doc.text("Signature", x, y);
      y += 15;
    }
  
    // Footer date
    doc.text(data.currentDate, x, y);
  
    // Save the file
    doc.save(`${data.studentName}_certificate.pdf`);
  }
  
  // Format date to DD/MM/YYYY
  function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `Date: ${dd}/${mm}/${yyyy}`;
  }
  
  // Convert file to base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  