import React from 'react';

export function Column(props: any){
  return (
    <div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
	    <h5 className="mb-4 text-lg font-semibold">{props.title}</h5>
      {props.children}
    </div>
  );
}
