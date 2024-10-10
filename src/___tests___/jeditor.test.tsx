import React from 'react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { ActionButton } from '../componentes/action-button';
import { render, screen } from '@testing-library/react';
import { JLogTokenizer } from '../componentes/journal/tokenizer';
import { TYPES as TagTypes } from '../user-tags/data-types';

// it('renders without crashing', () => {
//   const div = document.createElement('div');

//   createRoot(div)
//         .render(<div><ActionButton execAction={()=>{}}>aaaaa</ActionButton></div> );
// });

beforeEach(() => {
    //jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation((e) => {
        if( e.startsWith("Warning")){
             
        }
        else 
        {
            console.error(e)
        }
    });
  });
   

it('should parse a workout correctly...', async () => {
    // render(<ActionButton execAction={()=>new Promise(()=>{})}>Hola</ActionButton>);
 
    var tokenizer = await JLogTokenizer({
        tags:["Walking","Running"],
        utags:[],
        exercises:[
            { id:1, name:"Squat" },
            { id:2, name:"Bench Press"}
        ], 
        defaultYMD:"2020-01-01",
        printAllErrorsOnThrow: true
    }).textToPayload(`2020-01-12
@ 75 BW

${ Object.entries(TagTypes).map( entry=>entry[1].example ? Array.isArray(entry[1].example)? entry[1].example.join("\n") : entry[1].example :`` ).join("\n") }
Today was a good day
#Squat
60x3
100x5x5 haha
Then in the afternoon!...
#Bench Press
100x5x4 @5.5
The i just ran...
asdasd
#Farmer walk
140kg x 5m
#Running 
1300m in 10min

2023-11-12
Thenext day rest`,10, undefined); 
 
       
    expect( JSON.stringify(tokenizer) ).toMatchSnapshot();

    // await userEvent.click(screen.getByRole('button'))
    // await screen.findByRole('loader')

    // expect(screen.getByRole("loader")).toBeInTheDocument();
    // expect(1+1).toBe(3)
});