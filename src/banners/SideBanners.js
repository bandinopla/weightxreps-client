import WRDeadlift from "./wr-deadlift.jpg";
import SBD from "./sbd.jpg";
import Tipo from "./red-guy.png";
import Gif from "./side-banner.gif";
import TipoNavidad from "./red-guy-navidad.png";
import TipoNewYear from "./red-guy-newyear.png";
import MainBannerSrc from "./main-banner-athletes.png"; 
import StoreBannerSrc from "./store-banner.png";

//extras
import Chica1 from "./extras/chica1.png";
import Chica2 from "./extras/chica2.png";
import Chica3 from "./extras/chica3.png";
import Tipo2 from "./extras/tipo2.png";
import Tipo3 from "./extras/tipo3.png";

import { useHistory } from "react-router-dom";

import { Grid, useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useGetSession } from "../session/session-handler";
import { OpenConfirmModal } from "../componentes/Dialog";

export const SBDBanner = () => (
	<a href="https://weightxreps.net/sbd-stats" target="_self">
		<img className="sha" src={SBD} style={{ maxWidth: "100%" }} />
	</a>
);

const Banner = ({ src }) => {
	const theme = useTheme();
	const $sess = useGetSession();
	const history = useHistory();

	const onClick = () => {
		if ($sess.session) {
			history.push("/log-workout")
		} else {
			if (history.location.pathname != "/login") {
				history.push("/login");
			}

			OpenConfirmModal({
				title: "You need to log in first!",
				open: true,
				onConfirm: () => {},
				info: "It looks like you haven't logged in yet. Please do so to start logging!",
			});
		}
	};

	return (
		<div
			onClick={onClick}
			style={{
				marginTop: -8,
				position: "relative",
				maxHeight: 283,
				textAlign: "center",
				cursor: "pointer",
			}}
		>
			{/* <div
				style={{
					zIndex: -1,
					position: "absolute",
					top: 0,
					left: 0,
					width: "50%",
					height: "100%",
					//backgroundImage: `repeating-linear-gradient(41deg, ${theme.PINK_COLOR} 0, ${theme.PINK_COLOR} 2px, transparent 0, transparent 50%)`,
					//backgroundSize: "12px 12px", 
				}}
			></div>
			<div
				style={{
					zIndex: -1,
					position: "absolute",
					top: 0,
					left: "50%",
					width: "50%",
					height: "100%",
					//backgroundImage: `repeating-linear-gradient(41deg, ${theme.GREEN_COLOR} 0, ${theme.GREEN_COLOR} 1px, transparent 0, transparent 50%)`,
					//backgroundSize: "11px 11px",
                     
				}}
			></div> */}

			<img className="sha" fetchpriority="high" src={src} style={{ maxWidth: "100%", maxHeight:283, transform:"" }} />
            
		</div>
	);
};
//<StoreBanner/>
export const MainBanner = () => {
    const session = useGetSession();

    //return session.session? <StoreBanner/> : <Banner src={MainBannerSrc} />;
    return  <Banner src={MainBannerSrc} />;
}

export const MainBanner2 = () => <Banner src={MainBannerSrc} />;
export const StoreBanner = () => (
	<div
		onClick={()=>window.open("https://www.redbubble.com/shop/ap/128010572?ref=studio-promote","_blank")}
		style={{
			marginTop: -8,
			position: "relative",
			maxHeight: 383,
			textAlign: "center",
			cursor: "pointer", 
            marginTop:40
		}}
	> 

		<img className="sha" src={StoreBannerSrc} style={{ maxWidth: "50%", margin:"0 auto" }} />
	</div>
);

export const SideBanners = () => {
	//return <img src={sideGif}/>;
	return (
		<div style={{ maxWidth: "300px" }}>
			<SBDBanner />

			<Grid container spacing={1}>
				<Grid item xs={6}>
					<a href="https://www.youtube.com/watch?v=RoVTx8-dCms" target="_blank">
						<img
							className="sha"
							src={WRDeadlift}
							style={{ maxWidth: "100%" }}
						/>
					</a>
				</Grid>
				<Grid item xs={6}>
					{" "}
					<img className="sha" src={Gif} style={{ width: "100%" }} />{" "}
				</Grid>
			</Grid>
		</div>
	);
};

const TipoNavidadImg = () => <img src={TipoNavidad} />;
const TipoNewYearImg = () => <img src={TipoNewYear} />;
const TipoImg = () => <img src={Tipo} />;

/**
 * @typedef MyProps
 * @property {"chica1"|"chica2"|"chica3"|"tipo1"|"tipo2"|"tipo3"|"random"} variant
 *
 * @param {MyProps} param0
 * @returns
 */
export const RedGuyBanner = ({ variant = "tipo1" }) => {
	const [src, setSrc] = useState();
	var d = new Date();

	useEffect(() => {
		const variants = {
			chica1: Chica1,
			chica2: Chica2,
			chica3: Chica3,
			tipo1: Tipo,
			tipo2: Tipo2,
			tipo3: Tipo3,
		};

		let _src =
			variant == "random"
				? variants[
						Object.keys(variants).reduce(
							(_, __, i, arr) =>
								_ || arr[Math.floor(arr.length * Math.random())],
							null
						)
						//.find( (_,__,arr)=>Math.random()>0.5 )
				  ]
				: variants[variant] || Tipo;
		setSrc(_src);
	}, []);

	if (variant == "tipo1") {
		if (d.getMonth() == 11 && (d.getDate() == 24 || d.getDate() == 25)) {
			return <TipoNavidadImg />;
		}

		if (
			(d.getMonth() == 11 && d.getDate() > 29) ||
			(d.getMonth() == 0 && d.getDate() == 1)
		) {
			return <TipoNewYearImg />;
		}
	}

	return src ? (
		<img src={src} style={{ maxWidth: "100%" }} alt="Ilustrated character" />
	) : (
		""
	);
};
