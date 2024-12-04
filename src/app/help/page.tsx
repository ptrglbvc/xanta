const HelpPage = () => {
  return (
    <main>
      <h1>Xanta</h1>
      <p>
        Need a Secret Santa? Enter names & emails (minimum 3 participants) and
        we&rsquo;ll randomly assign each participent in the group a Santa!
      </p>
      <h2>How to Use:</h2>
      <ol>
        <li>Add participants: Name & email.</li>
        <li>
          Send Emails: Click &quot;Submit&quot; to send emails to each
          participant with their assigned person.
        </li>
        <li>
          The emails sometimes end up in the spam folder, so everyone should
          check there if there are no emails in the main inbox.
        </li>
      </ol>
      <p>
        <strong>Note:</strong> Requires valid emails. Your data is never stored.
      </p>
    </main>
  );
};

export default HelpPage;
