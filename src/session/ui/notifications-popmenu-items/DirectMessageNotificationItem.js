import { Avatar, Box, Typography } from "@material-ui/core";
import UnameTag from "../../../componentes/uname";
import { NotificationItemTemplate } from "./NotificationItemTemplate";
import NotificationItemUserAvatar from "./NotificationItemUserAvatar";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import TextQuote from "./TextQuote";
import { openDMWindow } from "../dms-window/dm-window";
import { UserTypedText } from "../../../componentes/user-typed-text";
import { useTheme } from "@material-ui/styles";
import { Alert } from "@material-ui/lab"; 
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

export default function DirectMessageNotificationItem({ data, myId }) {
	const theme = useTheme();
	let $iSentThis = data.by.id == myId;
	let $user = $iSentThis ? data.to : data.by;

	let $message = (
		<>
			{$iSentThis && (
				<strong>
					You sent{" "}
					<ArrowRightAltIcon
						style={{ verticalAlign: "sub" }}
						fontSize="small"
					/>
				</strong>
			)}

			{data.isGlobal ? (
				<Alert severity="info">
					<Typography variant="body2">
						<UserTypedText text={ data.text.trim().split("\n")[0] } short />
					</Typography> 
				</Alert>
			) : (
				<span className={"userText " + ($iSentThis && "sent")}>
					<UserTypedText text={data.text} short />
				</span>
			)}
		</>
	);

	let children;
    let isLike = false;

	if (data.__typename == "LikeOnDM") {

        isLike = true;
		children = (
			<>
				{$iSentThis ? "you liked this" : "liked your"} message 
			</>
		);
		$message = (
			<TextQuote>
				{" "}
				<UserTypedText text={data.text} />{" "}
			</TextQuote>
		);
	}

	return (
		<Box>
			<NotificationItemTemplate
				itemAvatar={ isLike? <Avatar><ThumbUpAltOutlinedIcon /></Avatar> : <NotificationItemUserAvatar user={$user} />}
		 
				when={data.when}
				message={$message}
				onClick={() => openDMWindow($user)}
			>
				<UnameTag inline {...$user} /> {children}
			</NotificationItemTemplate>
		</Box>
	);
}
