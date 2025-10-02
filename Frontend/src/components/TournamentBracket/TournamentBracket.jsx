import React from "react";
import Bracket from "../Bracket/Bracket";
import finalFourLogo from '../../assets/finalfourlogo.svg';
import './TournamentBracket.css';
import useTournamentData from "../../components/TournamentBracket/TournamentData";
import { useState, useEffect } from "react";

/*
    Displays entire tournament bracket

    Returns SVG to display bracket
*/
const TournamentBracket = () => {
    const {tournamentData, loading, error } = useTournamentData();

    const data = tournamentData;
    // Configuration
    // Width and Height of SVG 
    // (SVG covers half of the regions, left and right only ie. top or bottom is not covered together)

    const [svgWidth, setSvgWidth] = useState(window.innerWidth * 49 / 50);
    const [svgHeight, setSvgHeight] = useState(window.innerHeight / 1.5);

    useEffect(() => {
        const handleResize = () => {
            setSvgWidth(window.innerWidth * 49 / 50);
            setSvgHeight(window.innerHeight / 1.5);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Width and Height of bracket
    const bracketWidth = svgWidth / 8;
    const bracketHeight = svgHeight / 9;

    // Font size
    const regionFontSize = '1.25vh';

    // Horizontal spacing between each round
    const hSp1 = svgWidth/85;
    const hSp2 = -svgWidth/(hSp1*2);
    const hSp3 = -svgWidth/(hSp1*5);

    // Initial vertical spacing, the subsequent positions are calculated
    // This vertical spacing includes bracket height and thus is
    // Always bigger than bracketHeight
    // Division by 8 because 8 brackets need to be rendered in one svg
    const vSp = svgHeight / 8;

    const headerSpacing = [hSp1, hSp1+hSp2, hSp1+hSp2+hSp3];

    // Contains calculation to render brackets in corresponding regions
    const bracketRegionConfigs = {
        // top, right, left
        South: {
            first: {
                top: (i) => i * vSp,
                right: null,
                left: 0
            },
            second: {
                top: (i) => (i * 2 * vSp) + (vSp / 2),
                right: null,
                left: hSp1 + bracketWidth
            },
            sweet16: {
                top: (i) => (i * 4 * vSp) + (vSp * 3 / 2),
                right: null,
                left: 2 * bracketWidth + hSp1 + hSp2
            },
            elite8: {
                top: (i) => vSp * 7 / 2,
                right: null,
                left: 3 * bracketWidth + hSp1 + hSp2 + hSp3
            },
        },
        East: {
            first: {
                top: (i) => i * vSp,
                right: 0,
                left: null
            },
            second: {
                top: (i) => (i * 2 * vSp) + (vSp / 2),
                right: hSp1 + bracketWidth,
                left: null
            },
            sweet16: {
                top: (i) => (i * 4 * vSp) + (vSp * 3 / 2),
                right: 2 * bracketWidth + hSp1 + hSp2,
                left: null
            },
            elite8: {
                top: (i) => vSp * 7 / 2,
                right: 3 * bracketWidth + hSp1 + hSp2 + hSp3,
                left: null
            },
        },
        West: {
            first: {
                top: (i) => (i * vSp) + (6/5 * svgHeight),
                right: null,
                left: 0
            },
            second: {
                top: (i) => (i * 2 * vSp) + (vSp / 2) + (6/5 * svgHeight),
                right: null,
                left: hSp1 + bracketWidth
            },
            sweet16: {
                top: (i) => (i * 4 * vSp) + (vSp * 3 / 2) + (6/5 * svgHeight),
                right: null,
                left: 2 * bracketWidth + hSp1 + hSp2
            },
            elite8: {
                top: (i) => vSp * 7 / 2 + (6/5 * svgHeight),
                right: null,
                left: 3 * bracketWidth + hSp1 + hSp2 + hSp3
            },
        },
        Midwest: {
            first: {
                top: (i) => i * vSp + (6/5 * svgHeight),
                right: 0,
                left: null
            },
            second: {
                top: (i) => (i * 2 * vSp) + (vSp / 2) + (6/5 * svgHeight),
                right: hSp1 + bracketWidth,
                left: null
            },
            sweet16: {
                top: (i) => (i * 4 * vSp) + (vSp * 3 / 2) + (6/5 * svgHeight),
                right: 2 * bracketWidth + hSp1 + hSp2,
                left: null
            },
            elite8: {
                top: (i) => vSp * 7 / 2 + (6/5 * svgHeight),
                right: 3 * bracketWidth + hSp1 + hSp2 + hSp3,
                left: null
            },
        }
    }

    /* 
        Helper function to draw connecting lines between rounds

        fromX: x (end of first bracket)
        fromY: y (midpoint of first bracket)
        toX  : x (start of second bracket)
        toY  : y (midpoint of second bracket)

        returns L shaped line connecting next container
     */
    const renderConnector = (fromX, fromY, toX, toY) => {
        return (
            <path
                // start from fromX and from Y
                // draw L shaped line towards destination
                d={`M ${fromX} ${fromY}  
                    L ${toX} ${fromY} 
                    L ${toX} ${toY}`
                }
                stroke="orange"
                fill="none"
                strokeWidth="2"
            />
        );
    };

    return (
        <div>
            {/* Round Headers */}
            
            <div className="round-headers" style={{ display: "flex", position: "absolute", width: "100%", left: 0, marginTop: '1vh'}}>
                {[
                    { name: "First Round", date: "3/20-3/21"},
                    { name: "Second Round", date: "3/22-3/23"},
                    { name: "Sweet 16", date: "3/27-3/28"},
                    { name: "Elite Eight", date: "3/29-3/30"},
                    { name: "Final Four", date: "4/5-4/7"},
                    { name: "Elite Eight", date: "3/29-3/30"},
                    { name: "Sweet 16", date: "3/27-3/28"},
                    { name: "Second Round", date: "3/22-3/23"},
                    { name: "First Round", date: "3/20-3/21"}
                ].map((round, i) => (
                    <div 
                        key={`${round.name}-${i}`} 
                        style={{ 
                            textAlign: "center", 
                            flex: 1, 
                            marginRight: i < 3 ? headerSpacing[i] : 'auto',
                            marginLeft: i > 5 ? headerSpacing[8-i] : 'auto',
                            fontSize: '1.5vh'
                        }}
                    >
                        <p style={{marginBottom: "0.5rem"}}>{round.name}</p>
                        <p>{round.date}</p>
                    </div>
                ))}
            </div>

            <div className="tournament-bracket-container" style={{ position: "relative", width: svgWidth, height: svgHeight, top: '8vh'}}>
                {/* Render brackets with appropriate configurations */}
                {['South', 'East', 'West', 'Midwest'].map((region) => (
                    ['first', 'second', 'sweet16', 'elite8'].map((round) => (
                        data.regions[region][round].map((matchup, gameIndex) => (
                            <div
                                key={`${region}-${round}-${gameIndex}`}
                                style={{
                                    position: "absolute",
                                    top: bracketRegionConfigs[region][round].top(gameIndex) ?? 'auto',
                                    right: bracketRegionConfigs[region][round].right ?? 'auto',
                                    left: bracketRegionConfigs[region][round].left ?? 'auto',
                                    zIndex: 2
                                }}
                            >
                                <Bracket
                                    team1={matchup[0]}
                                    team2={matchup[1]}
                                    width={bracketWidth}
                                    height={bracketHeight}
                                    reverse={region == 'East' || region == 'Midwest'}
                                />
                            </div>
                        ))
                    ))
                ))}

                {/* Render region names */}
                {['South', 'East', 'West', 'Midwest'].map((region) => {
                    const isUp = region === 'South' || region === 'East';
                    const isLeft = region === 'South' || region === 'West';
                    
                    const positionStyle = {
                        position: "absolute",
                        top: svgHeight / 2 + (isUp ? 0 : (6 / 5) * svgHeight),
                        transform: `translateY(-75%)`,
                        textAlign: "center",
                        zIndex: 3,
                        fontSize: regionFontSize,
                        left: isLeft ? `${(3 / 2) * bracketWidth}px` : 'auto',
                        right: isLeft ? `auto` : `${(3 / 2) * bracketWidth}px`,
                    };

                    return (
                        <div key={region} style={positionStyle}>
                            {region.toUpperCase()}
                        </div>
                    );
                })}
                
                {/* SVG for connectors */}
                {['South', 'East', 'West', 'Midwest'].map((region) => {
                    const isUp = region === 'South' || region === 'East';
                    const isLeft = region === 'South' || region === 'West';

                    return (
                        <svg
                            key={`connector-${region}`} 
                            width={svgWidth}
                            height={svgHeight}
                            style={{
                                position: "absolute",
                                top: isUp ? 0 : (6 / 5 * svgHeight),
                                left: 0,
                                zIndex: 1,
                            }}
                        >
                            {/* First to Second Round */}
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                                const isSecondTeam = i % 2 === 1;

                                const fromX = isLeft 
                                    ? bracketWidth 
                                    : svgWidth - bracketWidth;
                                
                                const fromY = (i * vSp + bracketHeight / 2);
                                
                                const toX = isLeft 
                                    ? ((3 / 2 * bracketWidth) + hSp1) 
                                    : svgWidth - ((3 / 2 * bracketWidth) + hSp1);
                                
                                const toY = isSecondTeam
                                    ? fromY - (vSp - bracketHeight) / 2
                                    : fromY + (vSp - bracketHeight) / 2;

                                return (
                                    <g key={`connector-${region}-fToS-${i}`}>
                                        {renderConnector(fromX, fromY, toX, toY)}
                                    </g>
                                );
                            })}

                            {/* Second to Sweet 16 */}
                            {[0, 1, 2, 3].map((i) => {
                                const isSecondTeam = i % 2 === 1;

                                const fromX = isLeft 
                                    ? (2 * bracketWidth + hSp1) 
                                    : svgWidth - (2 * bracketWidth + hSp1);
                                
                                const fromY = ((i * 2 * vSp) + (vSp / 2) + bracketHeight / 2);
                                
                                const toX = isLeft 
                                    ? ((5 / 2 * bracketWidth) + hSp1 + hSp2) 
                                    : svgWidth - ((5 / 2 * bracketWidth) + hSp1 + hSp2);

                                const toY = isSecondTeam
                                    ? fromY - (2 * vSp - bracketHeight) / 2
                                    : fromY + (2 * vSp - bracketHeight) / 2;

                                return (
                                    <g key={`connector-${region}-SToS16-${i}`}>
                                        {renderConnector(fromX, fromY, toX, toY)}
                                    </g>
                                );
                            })}

                            {/* Sweet 16 to Elite 8 */}
                            {[0, 1].map((i) => {
                                const isSecondTeam = i % 2 === 1;

                                const fromX = isLeft 
                                    ? (3 * bracketWidth + hSp1 + hSp2) 
                                    : svgWidth - (3 * bracketWidth + hSp1 + hSp2);
                                
                                const fromY = ((i * 4 * vSp) + (vSp * 3 / 2) + bracketHeight / 2);
                                
                                const toX = isLeft 
                                    ? ((7 / 2 * bracketWidth) + hSp1 + hSp2 + hSp3) 
                                    : svgWidth - ((7 / 2 * bracketWidth) + hSp1 + hSp2 + hSp3);
                                
                                const toY = isSecondTeam
                                    ? fromY - (4 * vSp - bracketHeight) / 2
                                    : fromY + (4 * vSp - bracketHeight) / 2;

                                return (
                                    <g key={`connector-${region}-S16ToE8-${i}`}>
                                        {renderConnector(fromX, fromY, toX, toY)}
                                    </g>
                                );
                            })}
                        </svg>
                    );
                })}
            </div>

            <div className="tournament-bracket-container" style={{
                    position: "relative",
                    width: bracketWidth * 3 + 4 * hSp1,
                    height: svgHeight / 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    transform: "translate(-0%, -75%)",
                    top: bracketWidth/2
                }}
            >
                <img src={finalFourLogo} alt="Final Four Logo" width={svgWidth/10}/>

                <div style={{ position: "relative", top: 0, display: 'flex', gap: 2 * hSp1}}>
                    <Bracket
                        team1={data?.finalFour?.[0]?.[0] ?? null}
                        team2={data?.finalFour?.[0]?.[1] ?? null}
                        width={bracketWidth}
                        height={bracketHeight}
                    />
                    <Bracket
                        team1={data?.championship?.[0]?.[0] ?? null}
                        team2={data?.championship?.[0]?.[1] ?? null}
                        width={bracketWidth}
                        height={bracketHeight}
                    />
                    <Bracket
                        team1={data?.finalFour?.[1]?.[0] ?? null}
                        team2={data?.finalFour?.[1]?.[1] ?? null}
                        width={bracketWidth}
                        height={bracketHeight}
                    />
                </div>        
            </div>
        </div>
    );
};

export default TournamentBracket;