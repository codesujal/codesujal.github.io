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

  // Check if Date of Activity is selected
  if (!data.activityDate) {
    alert("Please select a valid date for 'Date of Activity'.");
    return; // Prevent PDF generation if no date is selected
  }

  const x = 60;
  let y = 80;
  const lineHeight = 22;
  const sectionGap = 10; // extra space between sections

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('times', 'normal'); // SERIF font

  // 1. Text content
  const lines = [
    `Activity Serial Number: ${data.serial}`,
    `Activity Name: ${data.activity}`,
    `Date of Activity: ${data.activityDate}`,
    `Activity Point: ${data.points}`,
    `Student Name: ${data.studentName}`,
    `Student University Roll Number: ${data.roll}`,
    `Department: ${data.dept}`,
    `Year: ${data.year}`,
    `Semester: ${data.semester}`
  ];
  lines.forEach(line => {
    doc.text(line, x, y);
    y += lineHeight;
  });

  // 2. Certificate Image
  const certImageInput = document.getElementById('bgImage').files[0];
  if (certImageInput) {
    const certImageData = await toBase64(certImageInput);

    const img = new Image();
    img.src = certImageData;

    await new Promise(resolve => {
      img.onload = () => {
        const imgHeight = 250;
        const scaleFactor = imgHeight / img.naturalHeight;
        const imgWidth = img.naturalWidth * scaleFactor;

        y += sectionGap;

        if (y + imgHeight > 800) {
          doc.addPage();
          y = 60;
        }

        doc.addImage(certImageData, 'PNG', x, y, imgWidth, imgHeight);
        y += imgHeight + sectionGap;
        resolve();
      };
    });
  }

  // 3. Links (without hyperlink)
  if (y + lineHeight > 800) {
    doc.addPage();
    y = 60;
  }

  // Extra gap before Links
  y += sectionGap;

  // Just print links as text, no hyperlink functionality
  doc.text(`Links (if any): ${data.links}`, x, y);
  y += lineHeight;

  // 4. Signature Text
  if (y + lineHeight > 800) {
    doc.addPage();
    y = 60;
  }
  y += sectionGap;
  doc.text("Signature:", x, y);
  y += lineHeight;

  // 5. Signature Image
  const signInput = document.getElementById('signatureImage').files[0];
  if (signInput) {
    const signData = await toBase64(signInput);

    const img = new Image();
    img.src = signData;

    await new Promise(resolve => {
      img.onload = () => {
        const signHeight = 40;
        const scaleFactor = signHeight / img.naturalHeight;
        const signWidth = img.naturalWidth * scaleFactor;

        if (y + signHeight > 800) {
          doc.addPage();
          y = 60;
        }

        doc.addImage(signData, 'PNG', x, y, signWidth, signHeight);
        y += signHeight + sectionGap;
        resolve();
      };
    });
  }

  // 6. Footer Date (with gap)
  if (y + 20 > 800) {
    doc.addPage();
    y = 60;
  }

  y += sectionGap;

  doc.text(data.currentDate, x, y);

  // Save the PDF
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
