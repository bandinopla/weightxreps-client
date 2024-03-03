import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useTheme
} from "@material-ui/core";
//import { MainMenu } from "../../data/Menu"; 
import { Best3Lifts } from "../../pages/journal-base";
import UCard from "../ucard";
import { userTextToParsedUI } from "../user-text-to-parsed-tags";
import { CalendarGrid } from "../calendario";
import Eblock from "../journal/erow-render";
import { parseUserComment } from "../journal/jparser";
import { JDayContext } from "../journal/jday-context";
import { dateToYMD } from "../../utils/utils";
import { memo } from "react";
import { MENU } from "../main-menu";

const TODAY = new Date();

function MockSiteSkeleton() {
	const theme = useTheme();

	//pointerEvents:"none",
	return (
		<Paper
			elevation={2}
			style={{ 
				transformOrigin: "top right",
				background: theme.palette.background.default,
				border: "16px solid #555", 
                pointerEvents:"none"
			}}
		>
			<Box padding={2}>
				{/* <AppBar position="relative" color="default" elevation={0}> */}
					<Toolbar>
						{MENU.slice(0,3).map((itm) => (
							<Button
								startIcon={itm.Icon ? <itm.Icon /> : <></>} 
							>
								{itm.label} 
							</Button>
						))}
					</Toolbar>
				{/* </AppBar> */}

				<Grid container style={{ marginTop: 10 }} spacing={2}>
					<Grid item sm={4}>
						<UCard
							data={{
								user: {
									id: 99999,
									uname: "LaraCroft",
									age: 25,
									bw: 130,
									usekg: false,
									cc: "gb",
									isf: true,
									joined: new Date(new Date().getTime() - 200000000000),
								},
								text: "Today i found the mask of Anubis",
								when: new Date(),
								utags: null,
								injournal: true,
							}}
						>
							<Best3Lifts
								data={[
									{ w: 100, e: { name: "Back Squat", type: "SQ" } },
									{ w: 70, e: { name: "Bench press", type: "BP" } },
									{ w: 150, e: { name: "Deadlift", type: "DL" } },
								]}
								usekg={false}
							/>
						</UCard>
					</Grid>
					<Grid item sm={8}>
						<MockCalendario />
						
					</Grid>
					<Grid item xs={12}>
                    <Typography variant="h2">Awesome Workout</Typography>
						{userTextToParsedUI(
							`Provident non provident aspernatur excepturi beatae maxime. https://www.youtube.com/watch?v=dQw4w9WgXcQ Perferendis fuga autem adipisci cumque et voluptatem quis quod. Sapiente aliquam praesentium voluptatem ut modi qui ex.`
						)}
						<br />
						<br />
						<Typography variant="body1">
							Normal system text. <strong>Important system text</strong>
						</Typography>
						<br />
						<br />
						<Button variant="contained" color="primary">
							Main Button
						</Button>
						&nbsp;&nbsp;
						<Button variant="contained" color="secondary">
							Secondary Button
						</Button>

						<JDayContext.Provider value={{ ymd: dateToYMD(TODAY) }}>
							<Eblock
								data={{
									exerciseRef: {
										exercise: { id: 1, name: "Back Squat", type: true },
										best: {
											eff: {
												est1rm: 140,
												w: 130,
												lb: true,
												when: "",
											},
											int: {
												w: 100,
												lb: true,
												when: "",
											},
										},
									},
									stats: {
										reps: 25,
										sets: 5,
										vol: 1050,
									},
									sets: [
										{
											w: 100,
											lb: true,
											r: 5,
											s: 5,
											rpe: 8,
											c: parseUserComment("Cool!"),
											weight: 100,
											eff: 0.8,
											int: 1,
										},
									],
								}}
							/>

							<Eblock
								data={{
									exerciseRef: {
										exercise: { id: 2, name: "JM Press"  },
										best: {
											eff: {
												est1rm: 70,
												w: 60,
												lb: true,
												when: "",
											},
											int: {
												w: 60,
												lb: true,
												when: "",
											},
										},
									},
									stats: {
										reps: 25,
										sets: 5,
										vol: 1050,
									},
									sets: [
										{
											w: 100,
											lb: true,
											r: 5,
											s: 5, 
											weight: 100,
											eff: 0.8,
											int: 1,
										},
									],
								}}
							/>
						</JDayContext.Provider>
						<Box marginTop={5}>
							<MockTable />
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}

function MockCalendario() {
	const WEEKS = 12;
	const DAYS = 7;

	let d = new Date(TODAY.getTime());
	d.setDate(d.getDate() + Math.round(-(WEEKS * DAYS * 0.5)));
	d.setDate(d.getDate() - d.getDay());

	const data = new Array(WEEKS * DAYS).fill(0).map((_, i) => {
		let key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

		//
		// hay data?
		//
		let isDefined = true;
		let hasData = Math.random() > 0.7;
		let dayOfMonth = d.getDate();
		let month = d.getMonth();
		const showYear =
			d.getFullYear() != TODAY.getFullYear()
				? "'" + d.getFullYear().toString().substr(2)
				: null;
		let highlighted =
			d.valueOf() > TODAY.valueOf() - 1000 * 60 * 60 * 24 * 14 &&
			d.valueOf() < TODAY.valueOf();
		const pinned =
			TODAY.getFullYear() == d.getFullYear() &&
			d.getMonth() == TODAY.getMonth() &&
			d.getDate() == TODAY.getDate();

		d.setDate(d.getDate() + 1);

		return {
			hasData,
			num: dayOfMonth,
			month,
			showYear,
			pinned,
			ymd: key,
			highlighted,
		};
	});

	return (
		<div style={{ overflow: "hidden" }}>
			<CalendarGrid data={data} weeks={WEEKS} days={DAYS} FDOW={0}/>
		</div>
	);
}

function MockTable() {
	function createData(name, calories, fat, carbs, protein) {
		return { name, calories, fat, carbs, protein };
	}

	const rows = [
		createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
		createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
		createData("Eclair", 262, 16.0, 24, 6.0),
	];

	return (
		<TableContainer component={Paper} size="small">
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Dessert (100g serving)</TableCell>
						<TableCell align="right">Calories</TableCell>
						<TableCell align="right">Fat&nbsp;(g)</TableCell>
						<TableCell align="right">Carbs&nbsp;(g)</TableCell>
						<TableCell align="right">Protein&nbsp;(g)</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.calories}</TableCell>
							<TableCell align="right">{row.fat}</TableCell>
							<TableCell align="right">{row.carbs}</TableCell>
							<TableCell align="right">{row.protein}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default memo(MockSiteSkeleton);
