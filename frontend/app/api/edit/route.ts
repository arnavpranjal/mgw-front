export async function GET(request: Request) {

return Response.json({
    dealname: "Sample Deal",
    dealdescription: "This is a sample deal description.",
    dealowner: "abc",
    dealstatus: "Active",
    dealstartdate: "2024-04-01",
    dealenddate: "2024-04-30",
    country: "India"
});
  }

export async function POST(request: Request){
    return Response.json({})
  }


