import React from "react";
import styles from "./documentation-page.module.css";

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className={styles.code}>
    <code>{children}</code>
  </pre>
);

const DocumentationPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Contributor guide</p>
        <h1 className={styles.title}>Repo access and deployment</h1>
        <p className={styles.lede}>
          How to get GitHub access, connect Vercel for frontend deploys, and
          connect AWS for backend and infrastructure.
        </p>
      </header>

      <nav className={styles.toc} aria-label="On this page">
        <a href="#github">GitHub</a>
        <a href="#vercel">Vercel</a>
        <a href="#aws">AWS</a>
        <a href="#quick-reference">Who controls what</a>
      </nav>

      <div className={styles.content}>
        <section id="github" className={styles.section}>
          <h2>1. GitHub</h2>

          <h3>Login</h3>
          <ol className={styles.steps}>
            <li>
              Create an account at{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                github.com
              </a>{" "}
              if you do not already have one.
            </li>
            <li>
              Enable two-factor authentication under{" "}
              <strong>Settings → Password and authentication</strong>. Some
              organizations require this before you can be added to a repo.
            </li>
          </ol>

          <h3>Getting repo access</h3>
          <p>
            You do not need to request access yourself. The repo owner or org
            admin will add you as a collaborator (or to a Team, for org
            repos).
          </p>
          <ol className={styles.steps}>
            <li>
              You will receive an email invite. Accept it from your inbox, or
              from the <strong>Notifications</strong> tab on GitHub once you
              are logged in.
            </li>
            <li>
              After you accept, clone the repo:
              <CodeBlock>
                {`git clone https://github.com/ieee-utd/ieee-site.git`}
              </CodeBlock>
              GitHub also shows an HTTPS clone URL on the repo page if you
              prefer that.
            </li>
          </ol>

          <h3>Recommended team workflow</h3>
          <p>
            The main or production branch is usually protected. Changes go
            through a pull request and review rather than being pushed
            directly. Work on a feature branch, open a pull request, and get
            it reviewed before merging.
          </p>

          <h3>Making a pull request</h3>
          <ol className={styles.steps}>
            <li>
              Make sure your local main branch is up to date:
              <CodeBlock>
                {`git checkout main
git pull`}
              </CodeBlock>
            </li>
            <li>
              Create a new branch for your change:
              <CodeBlock>{`git checkout -b your-branch-name`}</CodeBlock>
            </li>
            <li>
              Make your changes, then stage and commit them:
              <CodeBlock>
                {`git add .
git commit -m "short description of the change"`}
              </CodeBlock>
            </li>
            <li>
              Push the branch to GitHub:
              <CodeBlock>
                {`git push -u origin your-branch-name`}
              </CodeBlock>
            </li>
            <li>
              Open the repo on github.com. GitHub usually shows a banner for
              the branch you just pushed. Click{" "}
              <strong>Compare &amp; pull request</strong>.
            </li>
            <li>
              Give the pull request a clear title and a description of what
              changed and why. Assign reviewers if the repo does not do this
              automatically, then submit.
            </li>
            <li>
              Address review comments by pushing more commits to the same
              branch. The pull request updates automatically.
            </li>
            <li>
              Once it is approved and checks pass, merge the pull request,
              then delete the branch when prompted.
            </li>
          </ol>
        </section>

        <section id="vercel" className={styles.section}>
          <h2>2. Vercel</h2>

          <h3>Login</h3>
          <ol className={styles.steps}>
            <li>
              Go to{" "}
              <a href="https://vercel.com" target="_blank" rel="noreferrer">
                vercel.com
              </a>{" "}
              and sign up or log in with your GitHub account. That lets
              Vercel request repo access directly instead of using a separate
              password.
            </li>
            <li>
              If you are working with a team, the Vercel team owner still
              needs to invite your email under{" "}
              <strong>Team Settings → Members</strong>. That invite is
              separate from GitHub repo access.
            </li>
          </ol>

          <h3>Connecting Vercel to GitHub</h3>
          <ol className={styles.steps}>
            <li>
              In Vercel, choose <strong>Add New → Project → Import Git
              Repository</strong>.
            </li>
            <li>
              Authorize the Vercel GitHub App on your account or org when
              prompted. This installs a GitHub App with access to selected
              repos. It does not reuse your personal GitHub login.
            </li>
            <li>
              Select the repo to import. Vercel will auto-detect the
              framework and build settings.
            </li>
          </ol>

          <div className={styles.callout}>
            After it is connected, every push to the main branch triggers a
            production deployment. Every push to another branch, or every
            pull request, triggers a preview deployment with its own URL.
            Vercel comments that link on the pull request.
          </div>

          <p>
            Environment variables live under{" "}
            <strong>Project → Settings → Environment Variables</strong>. They
            can differ between production, preview, and development.
          </p>

          <h3>Managing access</h3>
          <ul className={styles.list}>
            <li>
              Who can push code is controlled in <strong>GitHub</strong>.
            </li>
            <li>
              Who can change Vercel project settings, env vars, or domains is
              controlled in <strong>Vercel Team Settings</strong>.
            </li>
          </ul>
          <p>
            These are independent. A GitHub collaborator is not automatically
            a Vercel team member.
          </p>
        </section>

        <section id="aws" className={styles.section}>
          <h2>3. AWS</h2>

          <h3>Login</h3>
          <ul className={styles.list}>
            <li>
              Use the root account only for initial setup, not daily work.
            </li>
            <li>
              Individual users should be IAM users, or go through IAM
              Identity Center if the org uses SSO, with only the permissions
              they need.
            </li>
            <li>
              Enable MFA on all IAM users, especially anyone with elevated
              permissions.
            </li>
          </ul>
          <p>For CLI or local access, set up credentials with:</p>
          <CodeBlock>{`aws configure`}</CodeBlock>
          <p>Or, if using SSO:</p>
          <CodeBlock>{`aws configure sso`}</CodeBlock>

          <h3>How AWS connects to GitHub</h3>
          <p>
            AWS does not have a built-in “login with GitHub” option like
            Vercel. The connection is for CI/CD, usually through GitHub
            Actions. There are two common approaches.
          </p>

          <div className={styles.optionGrid}>
            <article className={`${styles.optionCard} ${styles.recommended}`}>
              <p className={styles.badge}>Recommended</p>
              <h4>Option A — OIDC</h4>
              <p className={styles.optionSub}>
                No long-lived keys stored in GitHub
              </p>
              <ol className={styles.steps}>
                <li>
                  In AWS IAM, create an Identity Provider for{" "}
                  <code>token.actions.githubusercontent.com</code>.
                </li>
                <li>
                  Create an IAM role with a trust policy scoped to your
                  specific GitHub org, repo, and branch, allowing GitHub
                  Actions to assume it.
                </li>
                <li>
                  In the GitHub Actions workflow, the job requests a
                  short-lived token to assume that role. No AWS access keys
                  are stored in GitHub.
                </li>
              </ol>
            </article>

            <article className={styles.optionCard}>
              <p className={styles.badgeMuted}>Simpler, less secure</p>
              <h4>Option B — Static access keys</h4>
              <p className={styles.optionSub}>
                Easier setup, long-lived credentials in GitHub
              </p>
              <ol className={styles.steps}>
                <li>
                  Create an IAM user scoped to only what the deploy needs,
                  for example S3 and CloudFront, or ECS deploy permissions.
                </li>
                <li>Generate an access key and secret for that user.</li>
                <li>
                  Add them as GitHub encrypted secrets under{" "}
                  <strong>
                    Repo → Settings → Secrets and variables → Actions
                  </strong>
                  .
                </li>
                <li>
                  The workflow references those secrets when it runs.
                </li>
              </ol>
            </article>
          </div>

          <p>
            Prefer OIDC for team or production repos so you do not store
            long-lived credentials in GitHub.
          </p>

          <h3>Typical end-to-end flow</h3>
          <ol className={styles.flow}>
            <li>Push to GitHub, which triggers a GitHub Actions workflow.</li>
            <li>
              The workflow assumes an AWS IAM role through OIDC, or uses
              stored keys.
            </li>
            <li>
              It deploys or updates AWS resources such as S3, ECS, or Lambda.
            </li>
          </ol>
          <p>
            This runs independently of Vercel. A common setup is frontend on
            Vercel (deployed automatically from GitHub) and backend or infra
            on AWS (deployed through GitHub Actions).
          </p>
        </section>

        <section id="quick-reference" className={styles.section}>
          <h2>4. Who controls what</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>What</th>
                  <th>Where it is controlled</th>
                  <th>Covers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Code push and pull access</td>
                  <td>GitHub Collaborators or Teams</td>
                  <td>Who can clone, push, and open pull requests</td>
                </tr>
                <tr>
                  <td>Frontend deploy configuration</td>
                  <td>Vercel Team Settings</td>
                  <td>Env vars, domains, and deploy settings</td>
                </tr>
                <tr>
                  <td>AWS infrastructure access</td>
                  <td>IAM users and roles</td>
                  <td>Console and programmatic access to AWS resources</td>
                </tr>
                <tr>
                  <td>CI/CD deploy permission</td>
                  <td>GitHub Actions secrets or an OIDC role</td>
                  <td>Whether a workflow can deploy to AWS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;
