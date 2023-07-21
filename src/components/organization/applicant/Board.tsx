// @ts-nocheck
import React, { Key } from "react";
import Card from "./Card";
import { Column } from "./Column";
import { DraggableCard } from "./Card";
import { useLangStore } from "@/utils/code";

export function Board({ cards, columns, moveCard, applicantlist }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	return (
		<div className="flex h-[calc(100vh-132px)] overflow-auto p-4 py-10 lg:p-8">
			{columns.map((column) => (
				<Column
					key={column.id}
					title={column.title}
					// addCard={addCard.bind(null, column.id)}
				>
					{column.cardIds
						.map((cardId) => cards.find((card) => card.id === cardId))
						.map((card, index) =>
							applicantlist.map(
								(data, i) =>
									data["arefid"] == card.arefid && (
										<DraggableCard
											applicantlist={applicantlist}
											data={data}
											key={card.id}
											id={card.id}
											columnId={column.id}
											columnIndex={index}
											title={card.title}
											moveCard={moveCard}
											space={0}
										/>
									)
							)

							//   <DraggableCard
							//     applicantlist={applicantlist}
							//     key={card.id}
							//     id={card.id}
							//     columnId={column.id}
							//     columnIndex={index}
							//     title={card.title}
							//     moveCard={moveCard}
							//     space={0}
							//   />
						)}
					{column.cardIds.length === 0 && (
						<DraggableCard
							isSpacer
							moveCard={(cardId) => moveCard(cardId, column.id, 0)}
							// data={data}
							space={1}
						/>
					)}
				</Column>
			))}
		</div>
	);
}
