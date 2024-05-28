'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function EditButton(){
    return(
        
            <Link href="/dashboard/deal-mangement/edit-deal/edit/30"><Button>Edit Deal </Button></Link>
    )
}