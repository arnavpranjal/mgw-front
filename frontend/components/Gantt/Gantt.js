import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Gantt, textEditor } from "@dhx/trial-gantt";
import "@dhx/trial-gantt/codebase/dhtmlxgantt.css";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function GanttView({
  tasks,
  zoom,
  onDataUpdated,
  handleEditTask,
  handleAddTask,
  callapsAll,
}) {

  const router = useRouter();

  let container = useRef();
  window.myFunction = (id, text, startDate, endDate) => {
    handleEditTask(id, text, startDate, endDate);
  };

  var textEditor = { type: "text", map_to: "text" };
  var dateEditor = {
    type: "date",
    map_to: "start_date",
    min: new Date(2023, 0, 1),
    max: new Date(2024, 0, 1),
  };
  var durationEditor = { type: "number", map_to: "duration", min: 0, max: 100 };
  var priority = {
    type: "select",
    map_to: "priority",
    options: gantt.serverList("priority"),
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let gantt = Gantt.getGanttInstance();

      var colContent = function (task) {
        const add = ` <!-- Add Button -->
        <button onclick="addTask('${task.id}','${task.type}','${task.group}','${task.start_date}','${task.end_date}')" class="bg-gray-200 hover:bg-gray-300 text-green-500 hover:text-green-700 rounded-full p-1 focus:outline-none">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <!-- Add Button -->`;
        const edit = `  <!-- Edit Button -->
        <button onclick="myFunction('${task.id}','${task.text}','${task.start_date}','${task.end_date}',)" class="bg-gray-200 hover:bg-gray-300 text-green-500 hover:text-green-700 rounded-full p-1 focus:outline-none">
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
        </button>`;

        const del = ` <!-- Delete Button -->
        <button onclick="clickGridButton(${task.id}, 'delete')" class="bg-gray-200 hover:bg-gray-300 text-red-500 hover:text-red-700 rounded-full p-1 focus:outline-none">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
          </svg>
        </button>`;

        const risk = `  <!-- Warning Button -->
        <button onclick="clickGridButton(${task.id}, 'warning')" class="bg-gray-200 hover:bg-gray-300 text-yellow-500 hover:text-yellow-700 rounded-full p-1 focus:outline-none">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </button>`;

        const vdr = `  <!-- Cloud Button -->
        <button onclick="clickVdrButton(${task.id}, 'cloud','${task.text}')" class="bg-gray-200 hover:bg-gray-300 text-blue-500 hover:text-blue-700 rounded-full p-1 focus:outline-none">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </button>
      `;

        const fav = ` <button onclick="clickGridButton(${task.id}, 'cloud')" class="bg-gray-200 hover:bg-gray-300 text-blue-500 hover:text-blue-700 rounded-full p-1 focus:outline-none">
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2 l 3.09 8.5 h 8.91 l -7.22 5.53 2.75 8.47 L 12 18.83 l -7.53 5.67 2.75 -8.47 L 0 10.5 h 8.91 Z" />
      </svg>
         </button>`;
        if (task.type == "Task"||task.type == "milestone") {
          return `<div class="flex space-x-2 p-2">${fav}${edit}${del}${risk}${vdr}</div>`;
        } else {
          return `<div class="flex space-x-2 p-2">${add}${edit}${del}${risk}${vdr}</div>`;
        }
      };

      var colContent1 = function (task) {
        return <p>{}</p>;
      };

      gantt.config.columns = [
        {
          name: "wbs",
          label: "WBS",
          width: 40,
          template: gantt.getWBSCode,
        },
        {
          name: "text",
          tree: true,
          width: 140,
          min_width: 140,
          resize: true,
          label: "Name",
          editor: textEditor,
        },
        {
          name: "start_date",
          align: "center",
          resize: true,
          width: 100,
          min_width: 100,
        },
        {
          name: "duration",
          align: "center",
          resize: true,
          width: 60,
          min_width: 60,
        },
        {
          name: "buttons",
          label: "Action",
          align: "center",
          resize: true,
          width: 160,
          min_width: 160,
          template: colContent,
        },
      ];

      gantt.init(container.current);

      gantt.parse(tasks);

      gantt.attachEvent("onBeforeLightbox", function (id) {
        return false;
      });

      function initZoom() {
        gantt.ext.zoom.init({
          levels: [
            // {
            //   name: "Hours",
            //   scale_height: 60,
            //   min_column_width: 30,
            //   scales: [
            //     { unit: "day", step: 1, format: "%d %M" },
            //     { unit: "hour", step: 1, format: "%H" },
            //   ],
            // },
            // {
            //   name: "Days",
            //   scale_height: 60,
            //   min_column_width: 70,
            //   scales: [
            //     { unit: "week", step: 1, format: "Week #%W" },
            //     { unit: "day", step: 1, format: "%d %M" },
            //   ],
            // },
            {
              name:"Days",
              scale_height: 27,
              min_column_width:80,
              scales:[
                  {unit: "day", step: 1, format: "%d %M"}
              ]
            },
            {
              name:"Weeks",
              scale_height: 50,
              min_column_width:50,
              scales:[
               {unit: "week", step: 1, format: function (date) {
                var dateToStr = gantt.date.date_to_str("%d %M");
                var endDate = gantt.date.add(date, 6, "day");
                var weekNum = gantt.date.date_to_str("%W")(date);
                return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                }},
                {unit: "day", step: 1, format: "%j %D"}
              ]
            },
            {
              name:"Months",
              scale_height: 50,
              min_column_width:120,
              scales:[
                 {unit: "month", format: "%F, %Y"},
                 {unit: "week", format: "Week #%W"}
              ]
             },
          ],
        });
      }

      function setZoom(value) {
        if (!gantt.ext.zoom.getLevels()) {
          initZoom();
        }
        gantt.ext.zoom.setLevel(value);
      }

      const expandAll = () => {
        gantt.eachTask(function (task) {
          gantt.open(task.id); // Use gantt.open() instead of gantt.expand()
        });
      };

      // Collapse all tasks
      const collapseAll = () => {
        gantt.eachTask(function (task) {
          gantt.close(task.id); // Use gantt.close() instead of gantt.collapse()
        });
      };

      if (callapsAll == true) {
        collapseAll();
      } else {
        expandAll();
      }

      gantt.createDataProcessor((type, action, item, id) => {
        return new Promise((resolve, reject) => {
          onDataUpdated(type, action, item, id);
          // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
          //return resolve({id: databaseId});
          return resolve();
        });
      });

      setZoom(zoom);

      const onAfterLinkAdd = (id, link) => {
        const sourceTask = gantt.getTask(link.source);
        const targetTask = gantt.getTask(link.target);
        console.log("Link added: ", sourceTask.text, " -> ", targetTask.text);
        toast({
          title: `Link added`,
          variant: "default",
          description: `Link added: ${sourceTask.text} ->  ${targetTask.text}`,
        });
      };

      gantt.attachEvent("onAfterLinkAdd", onAfterLinkAdd);

      return () => {
        // gantt.detachEvent("onAfterLinkAdd", onAfterLinkAdd);
        gantt.clearAll();
        gantt.destructor();
        // container.current.innerHTML = "";
      };
    }
  }, [zoom, tasks, callapsAll]);

  window.addTask = (id, type, group, start_date, end_date) => {
    handleAddTask(id, type, group, start_date, end_date);
  };

  window.clickVdrButton =(id,type,text)=>{
    console.log({id,type,text})
    router.push(`/dashboard/vdr`);
  }

  return (
    <>
      <div ref={container} style={{ width: "100%", height: "100%" }}></div>
    </>
  );
  // }
}
