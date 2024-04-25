'use client';
import {redirect} from "next/navigation";

export default function Home(){
    const path = window.location.pathname;
    redirect(path + '/page/1');
}