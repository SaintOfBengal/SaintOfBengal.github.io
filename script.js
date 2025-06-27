// Function to extract the file ID from the Google Drive URL
function extractFileId(url) {
  var matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\/view|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  // Ensure a match is found before trying to access groups
  if (matches) {
    return matches[1] || matches[2] || matches[3];
  }
  return null; // Return null if no file ID is found
}

// Function to show custom modal pop-up
function showModal(title, message) {
  const modal = document.getElementById('customModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  modal.classList.add('show');
}

// Function to hide custom modal pop-up
function hideModal() {
  const modal = document.getElementById('customModal');
  modal.classList.remove('show');
}

// Function to clear all result boxes and input field
function clearBoxes() {
  document.getElementById('visitButton').href = '#';
  document.getElementById('temporaryVisitButton').href = '#';
  document.getElementById('resultBox').classList.remove('animate-in');
  document.getElementById('temporaryResultBox').classList.remove('animate-in');

  // Clear the input field and restore the placeholder
  document.getElementById('inputUrl').value = '';
  restorePlaceholder();

  // Re-enable buttons if they were disabled
  document.getElementById('generateButton').classList.remove('disabled');
  document.getElementById('copyButton').classList.remove('disabled');
  document.getElementById('visitButton').classList.remove('disabled');
  document.getElementById('temporaryCopyButton').classList.remove('disabled');
  document.getElementById('temporaryVisitButton').classList.remove('disabled');
}

// Function to copy the permanent link to the clipboard
function copyPermanentLink() {
  var permanentLink = document.getElementById('visitButton').href;
  if (permanentLink === '#' || document.getElementById('copyButton').classList.contains('disabled')) {
    showModal('Copy Error', 'No permanent link to copy yet. Generate a link first.');
    return;
  }
  const tempInput = document.createElement('input');
  tempInput.value = permanentLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showModal('Copied!', 'Permanent link copied to clipboard!');
}

// Function to copy the temporary link to the clipboard
function copyTemporaryLink() {
  var temporaryLink = document.getElementById('temporaryVisitButton').href;
  if (temporaryLink === '#' || document.getElementById('temporaryCopyButton').classList.contains('disabled')) {
    showModal('Copy Error', 'No temporary link to copy yet. Generate a link first.');
    return;
  }
  const tempInput = document.createElement('input');
  tempInput.value = temporaryLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showModal('Copied!', 'Temporary link copied to clipboard!');
}

// Function to restore the placeholder when input loses focus
function restorePlaceholder() {
  var input = document.getElementById('inputUrl');
  if (!input.value) {
    input.placeholder = "ENTER GOOGLE DRIVE LINK"; // Updated placeholder
  }
}

// Function to generate links and update result boxes
function generateLinks() {
  var inputUrl = document.getElementById('inputUrl').value;
  var fileId = extractFileId(inputUrl);
  var generateButton = document.getElementById('generateButton');
  var copyButton = document.getElementById('copyButton');
  var visitButton = document.getElementById('visitButton');
  var temporaryCopyButton = document.getElementById('temporaryCopyButton');
  var temporaryVisitButton = document.getElementById('temporaryVisitButton');

  // Disable buttons to prevent multiple clicks
  generateButton.classList.add('disabled');
  copyButton.classList.add('disabled');
  visitButton.classList.add('disabled');
  temporaryCopyButton.classList.add('disabled');
  temporaryVisitButton.classList.add('disabled');


  if (!fileId) {
    showModal('Error 469!', 'Invalid Google Drive URL. Please Enter a Valid Public Google Drive Link.');
    generateButton.classList.remove('disabled');
    copyButton.classList.remove('disabled');
    visitButton.classList.remove('disabled');
    temporaryCopyButton.classList.remove('disabled');
    temporaryVisitButton.classList.remove('disabled');
    return;
  }

  var temporaryUrl = 'https://index.ys4m68pa.workers.dev/generate.aspx?id=' + fileId;

  // Send a request to the generate URL to get the JSON response for the temporary link
  fetch(temporaryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to retrieve the temporary link. Status: ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      var temporaryLink = data.link;
      if (data.mac) {
        temporaryLink += '&mac=' + data.mac;
      }

      // Update permanent link
      var permanentUrl = 'https://index.ys4m68pa.workers.dev/direct.aspx?id=' + fileId;
      document.getElementById('visitButton').href = permanentUrl;

      // Update temporary link
      document.getElementById('temporaryVisitButton').href = temporaryLink;

      // Animate result boxes
      document.getElementById('resultBox').classList.add('animate-in');
      document.getElementById('temporaryResultBox').classList.add('animate-in');

      // Show success pop-up
      showModal('Generation Completed', 'Your download links have been successfully generated! Please copy the Link and use IDM for Best Download Speed.. 😇');

      // Re-enable buttons
      generateButton.classList.remove('disabled');
      copyButton.classList.remove('disabled');
      visitButton.classList.remove('disabled');
      temporaryCopyButton.classList.remove('disabled');
      temporaryVisitButton.classList.remove('disabled');
    })
    .catch(function (error) {
      console.error('Error:', error);
      showModal('Generation Failed', 'Failed to generate links. Please check the URL and ensure the service is available. Contact @venex on Telegram for Support');
      // Re-enable buttons on error
      generateButton.classList.remove('disabled');
      copyButton.classList.remove('disabled');
      visitButton.classList.remove('disabled');
      temporaryCopyButton.classList.remove('disabled');
      temporaryVisitButton.classList.remove('disabled');
    });
}
