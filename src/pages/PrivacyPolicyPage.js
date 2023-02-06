import { Box, Typography } from "@material-ui/core";
import TermsPageBase from "../layout/TermsPageBase";


const NAME = `<strong>Weight For Reps</strong>`


/*
{
    title:"",
    text:""
}
*/
const data = [
    {
        title: "Data Management",
        text: `By visiting our Website and/or using our Services on <WXR> (from now on refered to as "the Platform") you are agreeing to the terms of this Privacy Policy and the accompanying Terms of Use. In any case, we do not send or sell your personal information. We do not generate derived information from it nor we create any type of relational tree to analyze your social interactions like other platforms do. 
        `
    },
    {
        title: "The Information We Collect",
        text: `The only sensitive data we store in our database is your email. When you sign up with the platform you will be required to provide us with personal information about yourself, which may include your name, address, e-mail address, and phone number.
                If you elect to sign in to the Platform using other providers such as Google, Twitter, Github, etc... you are authorizing the platform to obtain, vía those providers, the personal information they will give us and you agree upon when using them (they will ask for your permission)
                but we delete that data right after you log in. Only the email is collected and stored in our database.
                <br/><br/>
                In detail, this is the sensitive info we get from you:
                <ul>
                    <li><strong>e-mail</strong>: This is required from us to either contact you or ask for confirmation in case you want to change settings that require it.</li>
                    <li><strong>phone</strong>: <u>Only in the case you opt in to sign in using a phone number</u>. And this is deleted from our database once you log in, we dont persist this data. A third-party library we use (<a href="https://firebase.google.com/" target="_blank">Firebase</a>) will use that to send you an SMS with a code to help you sign-in.</li>
                </ul>
                `
    },
    {
        title: "The Information Collected by or Through Third-Party Companies",
        text: `If you decide to Sign In using a third-party provider like Google or Twitter you will be granting us access to the information they provide and that you gave your consent beforehand but we only use the "email" we dont store anything else from them.`
    },
    {
        title: "Accessing and Modifying Personal Information",
        text: "At any time you can go to your settings and change your email, password, and a bunch of other stuff."
    },
    {
        title: "How We Protect Your Information",
        text: `We take commercially reasonable steps to protect the Information from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. Please understand, however, that no security system is impenetrable. We cannot guarantee the security of our databases, nor can we guarantee that the information you supply will not be intercepted while being transmitted to and from us over the Internet. In particular, e-mail sent to or from the Platform may not be secure, and you should therefore take special care in deciding what information you send to us via e-mail.
        <br/>Everything you post is stored as plain text in our database. Dont post anything sensitive, credit card information, personal address, etc... we wont read your personal messages, but we don't know if the hosting provider will. Who knows... be safe.`
    },
    {
        title: "Changes to This Privacy Policy",
        text: "We may change this Privacy Policy from time to time. By accessing the Platform and/or using the Services after we make any such changes to this Privacy Policy, you are deemed to have accepted such changes. Please be aware that, to the extent permitted by applicable law, our use of the Information is governed by the Privacy Policy in effect at the time we collect the information. Please refer back to this Privacy Policy on a regular basis."
    },
    {
        title: "How to Contact Us",
        text: "admin@weightxreps.net"
    }
]


export default function TermsOfServicePage() {
    return <TermsPageBase>

        <Box margin={2}>
            <Typography variant="h3" variantMapping={{ h3: "h1" }} gutterBottom>Privacy Policy</Typography>
            <br />
        </Box>

        {data.map(block => <Box margin={2}>
            <Typography variant="h6" variantMapping={{ h6: "h2" }} gutterBottom>{block.title}</Typography>
            <Typography variant="body1" gutterBottom dangerouslySetInnerHTML={{ __html: block.text.replace("<WXR>", NAME) }}></Typography>
        </Box>)}

    </TermsPageBase>
}