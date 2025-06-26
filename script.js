// Function to extract the file ID from the Google Drive URL
function extractFileId(url) {
  var matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\/view|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  // Ensure a match is found before trying to access groups
  if (matches) {
    return matches[1] || matches[2] || matches[3];
  }
  return null; // Return null if no file ID is found
}

// Function to clear all result boxes and input field
function clearBoxes() {
  document.getElementById('sourceLink').textContent = '#';
  document.getElementById('visitButton').href = '#';
  document.getElementById('temporaryVisitButton').href = '#';
  document.getElementById('sourceLinkBox').classList.remove('animate-in');
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
    alert('No permanent link to copy yet. Generate a link first.');
    return;
  }
  navigator.clipboard.writeText(permanentLink).then(function () {
    alert('Permanent link copied to clipboard!');
  }, function (err) {
    console.error('Unable to copy the permanent link: ', err);
    alert('Failed to copy the permanent link. Please try again.');
  });
}

// Function to copy the temporary link to the clipboard
function copyTemporaryLink() {
  var temporaryLink = document.getElementById('temporaryVisitButton').href;
  if (temporaryLink === '#' || document.getElementById('temporaryCopyButton').classList.contains('disabled')) {
    alert('No temporary link to copy yet. Generate a link first.');
    return;
  }
  navigator.clipboard.writeText(temporaryLink).then(function () {
    alert('Temporary link copied to clipboard!');
  }, function (err) {
    console.error('Unable to copy the temporary link: ', err);
    alert('Failed to copy the temporary link. Please try again.');
  });
}

// Function to restore the placeholder when input loses focus
function restorePlaceholder() {
  var input = document.getElementById('inputUrl');
  if (!input.value) {
    input.placeholder = "Google Drive File Link";
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
    alert('Invalid Google Drive URL. Please ensure it contains a file ID.');
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

      // Update source link
      var sourceUrl = inputUrl;
      document.getElementById('sourceLink').textContent = sourceUrl;

      // Update permanent link
      var permanentUrl = 'https://index.ys4m68pa.workers.dev/direct.aspx?id=' + fileId;
      document.getElementById('visitButton').href = permanentUrl;

      // Update temporary link
      document.getElementById('temporaryVisitButton').href = temporaryLink;

      // Animate result boxes
      document.getElementById('sourceLinkBox').classList.add('animate-in');
      document.getElementById('resultBox').classList.add('animate-in');
      document.getElementById('temporaryResultBox').classList.add('animate-in');

      // Re-enable buttons
      generateButton.classList.remove('disabled');
      copyButton.classList.remove('disabled');
      visitButton.classList.remove('disabled');
      temporaryCopyButton.classList.remove('disabled');
      temporaryVisitButton.classList.remove('disabled');
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('Failed to generate links. Please check the URL and ensure the service is available.');
      // Re-enable buttons on error
      generateButton.classList.remove('disabled');
      copyButton.classList.remove('disabled');
      visitButton.classList.remove('disabled');
      temporaryCopyButton.classList.remove('disabled');
      temporaryVisitButton.classList.remove('disabled');
    });
}