import { FunctionComponent } from "react";
import { GetAchievementsQueryResult } from "../data/generated---db-types-and-hooks";
import { Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { AchievementsIcons as $icons } from "./AchievementsIcons"; 

interface AchievementsReferenceModalProps {
    achievements: GetAchievementsQueryResult["data"]["getAchievements"]
}
 
const AchievementsReferenceModal: FunctionComponent<AchievementsReferenceModalProps> = ({ achievements }) => {
    return <div>
        <Typography gutterBottom>
            These achievements are badges that are given if an accomplishment was done <strong>recently</strong>. These represent the current state, not historical achievements. The goal is to aid in having a better perception of your current shape. So you can lose this achievements if you slack off!
        </Typography>
 

        <Table size="small">
            <TableBody>
                {
                    achievements.map( ach=><TableRow key={ach.id}>
                        <TableCell>
                            <img src={ $icons[ach.id] } title={ach.name}/>
                        </TableCell>
                        <TableCell>
                            <strong>{ach.name}</strong>: {ach.description}
                        </TableCell>
                    </TableRow>)
                }
            </TableBody>
        </Table>
    </div>
}
 
export default AchievementsReferenceModal;