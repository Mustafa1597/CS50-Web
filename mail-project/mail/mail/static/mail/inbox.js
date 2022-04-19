document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  // By default, load the inbox
  load_mailbox('inbox');


  // Adding form submit handler
  document.querySelector("#compose-form").onsubmit = function() {
    let recipients = document.querySelector("#compose-recipients").value;
    let subject = document.querySelector("#compose-subject").value;
    let body = document.querySelector("#compose-body").value;


    fetch("emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    load_mailbox("sent");

    return false;
  };

  // Add handlers for viewing and archive/unarchive an email
  document.addEventListener("click", function(event) {
    if (event.target.className === "email") {
      load_email(event.target.dataset.id);
      set_read(event.target.dataset.id);
    }
    if (event.target.classList.contains("archive-button")) {
      set_archived(event.target.parentElement.dataset.id, true);
      event.target.parentElement.style.animationPlayState = "running";
      event.target.parentElement.addEventListener("animationend", function() {
        event.target.parentElement.remove();
      });
    }
    if (event.target.classList.contains("unarchive-button")) {
      set_archived(event.target.parentElement.dataset.id, false);
      event.target.parentElement.style.animationPlayState = "running";
      event.target.parentElement.addEventListener("animationend", function() {
        event.target.parentElement.remove();
      });
    }
  });

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector("#email-view").style.display = "none";
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function set_read(email_id) {
  fetch(`emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
}

function set_archived(email_id, value) {
  fetch(`emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: value
    })
  });
}

function compose_reply(recipient, subject, body, timestamp) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector("#email-view").style.display = "none";
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipient;
  document.querySelector('#compose-subject').value = "Re: " + subject;
  document.querySelector('#compose-body').value = `On ${timestamp} ${recipient} wrote:\n${body}`;
}

function load_email(email_id) {
  fetch(`emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector("#email-view").innerHTML = "";
    const fromDiv = document.createElement("div");
    fromDiv.innerHTML = `<strong>From:</strong> ${email.sender}`;

    const toDiv = document.createElement("div");
    let recipients = "";
    for (let recipient of email.recipients) {
      recipients += recipient + " ";
    }
    toDiv.innerHTML = `<strong>To:</strong> ${recipients}`;

    const subjectDiv = document.createElement("div");
    subjectDiv.innerHTML = `<strong>subject:</strong> ${email.subject}`;

    const timestampDiv = document.createElement("div");
    timestampDiv.innerHTML = `<strong>timestamp:</strong> ${email.timestamp}`;

    const bodyDiv = document.createElement("div");
    bodyDiv.innerHTML = `${email.body}`;

    const replyDiv = document.createElement("div");
    const replyButton = document.createElement("button");
    replyButton.innerHTML = "Reply";
    replyButton.classList.add("btn");
    replyButton.classList.add("btn-sm");
    replyButton.classList.add("btn-outline-primary");
    
    replyButton.onclick = function() {
      compose_reply(email.sender, email.subject, email.body, email.timestamp);
    };
    replyDiv.append(replyButton);


    const emailView = document.querySelector("#email-view");
    emailView.append(fromDiv);
    emailView.append(toDiv);
    emailView.append(subjectDiv);
    emailView.append(timestampDiv);
    emailView.append(replyDiv);
    emailView.append(document.createElement("hr"));
    emailView.append(bodyDiv);

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector("#email-view").style.display = "block";
    document.querySelector('#compose-view').style.display = 'none';

  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector("#email-view").style.display = "none";
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  console.log(mailbox);


  // Load Mails 
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);

    emails.forEach(email => {
      const id = email.id;
      const sender = email.sender;
      const subject = email.subject;
      const timestamp = email.timestamp;
      const read = email.read;

      const senderSpan = document.createElement("span");
      senderSpan.className = "sender";
      senderSpan.innerHTML = sender;

      const subjectSpan = document.createElement("span");
      subjectSpan.className = "subject";
      subjectSpan.innerHTML = subject;

      const timestampSpan = document.createElement("span");
      timestampSpan.className = "timestamp";
      timestampSpan.innerHTML = timestamp;

      const emailDiv = document.createElement("div");
      emailDiv.className = "email";
      emailDiv.append(senderSpan);
      emailDiv.append(subjectSpan);
      emailDiv.dataset.id = id;


      // Adding archive button for emails in inbox mailbox
      if (mailbox.toLowerCase() === "inbox") {
        const archiveButton = document.createElement("button");
        archiveButton.innerHTML = "Archive";
        archiveButton.classList.add("btn");
        archiveButton.classList.add("btn-sm");
        archiveButton.classList.add("btn-outline-primary");
        archiveButton.classList.add("archive-button");
        emailDiv.append(archiveButton);
      }
      
      // Adding unarchive button for emails in archive mailbox
      if (mailbox.toLowerCase() === "archive") {
        const unarchiveButton = document.createElement("button");
        unarchiveButton.innerHTML = "Unarchive";
        unarchiveButton.classList.add("btn");
        unarchiveButton.classList.add("btn-sm");
        unarchiveButton.classList.add("btn-outline-primary");
        unarchiveButton.classList.add("unarchive-button");
        emailDiv.append(unarchiveButton);
      }

      emailDiv.append(timestampSpan);

      if (read === true) {
        emailDiv.style.backgroundColor = "lightgray";
      }
      document.querySelector('#emails-view').append(emailDiv);
    });

  });
}