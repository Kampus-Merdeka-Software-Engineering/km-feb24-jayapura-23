
function loadExcelData() {

    const file = 'path_to_your_excel_file.xlsx';

    fetch(file)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const data = new Uint8Array(buffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const firstColumnName = worksheet['A1'].v;
            document.getElementById('table').innerText = firstColumnName;
        })
        .catch(error => console.error('Error loading Excel file:', error));
}
window.onload = function() {
    loadExcelData();
};