import { Box, Container, Paper, Typography } from "@material-ui/core";
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
        title:"Acceptance of Terms",
        text:`<WXR> welcomes you. We invite you to access and use our online services (the “Services”), which are made available to you through a variety of platforms, including https://weightxreps.net (the “Website”) and through our mobile app, which is accessible through tablets, cell phones, personal digital assistants, connected televisions, and other devices (the “App”). The Website and the App are collectively referred to as the “Platform.”
        <br/>
        We are under no obligation to accept any individual as a Registered User, and may accept or reject any Registered User in our sole and complete discretion.
        
        `
    },
    {
        title:"Description of Services",
        text:"We offer a tool that registered users can use to keep a track of their weight training progress by providing a system in which logging their workouts in a particular format will trigger and generate a bunch of stats and graphs based on that data that can be used to evaluate progress and other aspects derived from such data."
    },
    {
        title:"Restrictions",
        text:"The Platform is available for individuals 18 years or older. If you are under 18, please do not use the Platform. By accessing and using the Platform, you represent and warrant that you are at least 18."
    },
    {
        title:"Disclaimer",
        text:"YOU SHOULD CONSULT YOUR PHYSICIAN BEFORE STARTING ANY EXERCISE PROGRAM.<br/>The comunity stats are only there to help you gauge your performance in relation to other registered users, it is not a competition."
    },
    {
        title:"Donations",
        text:"At the moment we accept donations vía PayPal. This is a voluntary, non recurrent payment done by you with the intention to financially help the site grow and stay online. This can be done at any time at any interval and any amount you want. "
    },
    {
        title:"Community Guidelines",
        text:"Common sense rules apply. Any somewhat well educated or reasonable person will know/understand the non-verbal agreements and norms socially accepted to interact with other humans in a civilized and respectful maner. If you need a big list of DO and DON'Ts to know how to behave, dont use this site."
    },
    {
        title:"Personal Data",
        text:"During the signup process we will ask you for a desired Username, your email, gender (used to change your username color and separate male from female on the comunity stats), default weight unit and a password. If you use the \"Sign In with\" options, you will grant our Platform access to your email vía the chosen platform. Everything you post will be public. Direct messages won't but they will be stored as plain text in our database so dont assume otherwise. "
    },
    {
        title:"Intellectual Property",
        text:"In regards to the contents of this platform and the data it generates: You may not sell, transfer, assign, license, sublicense, or modify the Content or reproduce, display, publicly perform, make a derivative version of, distribute, or otherwise use the Content in any way for any public or commercial purpose. The use or posting of the Content on any other website or in a networked computer environment for any purpose is expressly prohibited."
    },
    {
        title:"Communications",
        text:"Common sense rules apply. Never share personal or confidential information online. YOU ARE ENTIRELY RESPONSIBLE FOR ALL THE USER CONTENT THAT YOU UPLOAD, POST OR OTHERWISE TRANSMIT VIA THE PLATFORM."
    },
    {
        title:"No Warranties. Limitation of Liability",
        text:`THE PLATFORM, THE CONTENT, AND THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS WITHOUT ANY WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE WARRANTY OF TITLE, MERCHANTABILITY, NON-INFRINGEMENT OF THIRD PARTIES’ RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE.

        IN NO EVENT SHALL WE BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, INCIDENTAL AND CONSEQUENTIAL DAMAGES, LOST PROFITS, OR DAMAGES RESULTING FROM LOST DATA OR BUSINESS INTERRUPTION) RESULTING FROM THE USE OR INABILITY TO USE THE PLATFORM, THE CONTENT, OR THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME STATES DO NOT ALLOW EXCLUSIONS OF CERTAIN WARRANTIES OR LIMITATION OF LIABILITY FOR CERTAIN DAMAGES, SO THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU. IN SUCH STATES, OUR WARRANTIES AND OUR LIABILITY SHALL BE LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW.
        
        THE PLATFORM AND THE CONTENT MAY CONTAIN TECHNICAL INACCURACIES OR TYPOGRAPHICAL ERRORS OR OMISSIONS. WE ARE NOT RESPONSIBLE FOR ANY SUCH TYPOGRAPHICAL OR TECHNICAL ERRORS LISTED ON THE PLATFORM. `
    },

    {
        title:"External Sites",
        text:"The Platform may contain links to third-party websites (“External Sites”). These links are provided solely as a convenience to you and not as an endorsement by us of the content on such External Sites. The content of such External Sites is developed and provided by others. You should contact the site administrator or webmaster for those External Sites if you have any concerns regarding such links or any content located on such External Sites. We are not responsible for the content of any linked External Sites and do not make any representations regarding the content or accuracy of materials on such External Sites. You should take precautions when downloading files from all websites to protect your computer from viruses and other destructive programs. If you decide to access linked External Sites, you do so at your own risk."
    },

    {
        title:"Indemnification",
        text:"You agree to defend, indemnify, and hold us and our officers, directors, employees, successors, licensees, and assigns harmless from and against any claims, actions, or demands, including, without limitation, reasonable legal and accounting fees, arising or resulting from your breach of this Agreement or your access to, use, or misuse of the Platform, the Content, or our Services. We shall provide notice to you of any such claim, suit, or proceeding and shall assist you, at your expense, in defending any such claim, suit, or proceeding. We reserve the right, at your expense, to assume the exclusive defense and control of any matter that is subject to indemnification under this section. In such case, you agree to cooperate with any reasonable requests assisting our defense of such matter."
    },

    {
        title:"Termination Of The Agreement / Delete account",
        text:"We reserve the right, in our sole discretion, to restrict, suspend, or terminate this Agreement and your access to the Platform, at any time and for any reason without prior notice or liability. We reserve the right to change, suspend, or discontinue all or any part of the Platform at any time without prior notice or liability. If you wish to terminate this Agreement or your <WXR> account, you may go to your settings and delete your account. That will delete all your data from our database, there's no way to undo this action."
    }
]


export default function TermsOfServicePage() {
    return <TermsPageBase>

                    <Box margin={2}>
                    <Typography variant="h3" variantMapping={{h3:"h1"}} gutterBottom>Terms Of Service</Typography>
                    <br/> </Box>
 

                    { data.map( block=><Box margin={2}>
                        <Typography variant="h6"  variantMapping={{h6:"h2"}} gutterBottom>{block.title}</Typography>
                        <Typography variant="body1" gutterBottom dangerouslySetInnerHTML={{__html: block.text.replace("<WXR>", NAME) }}></Typography>
                    </Box> ) }
                     
                </TermsPageBase>
}