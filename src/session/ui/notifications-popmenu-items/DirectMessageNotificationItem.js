import { Box, Typography } from "@material-ui/core";
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

	if (data.__typename == "LikeOnDM") {
		children = (
			<>
				{$iSentThis ? "You liked this" : "Liked your"} message{" "}
				<ThumbUpAltIcon style={{ verticalAlign: "sub" }} fontSize="small" />
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
				itemAvatar={<NotificationItemUserAvatar user={$user} />}
				title={<UnameTag inline {...$user} />}
				when={data.when}
				message={$message}
				onClick={() => openDMWindow($user)}
			>
				{children}
			</NotificationItemTemplate>
		</Box>
	);
}
