import supabase from "../../../CONFIG/supabaseClient";

const Home = () => {
    console.log(supabase);
    return (
        <div className="page home">
            <h1>Home</h1>
        </div>
    );
}   

export default Home;