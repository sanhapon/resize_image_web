use warp::Filter;

#[tokio::main]
async fn main() {

    let index_route = warp::path::end()
                    .and(warp::fs::file("public/index.html"));

    let js_route = warp::path("assets")
                    .and(warp::fs::dir("public/assets"));

    let routes = warp::get().and(
        index_route
        .or(js_route)
    ).with(warp::cors().allow_any_origin());

    println!("Starting server");
    warp::serve(routes).run(([0, 0, 0, 0], 12345)).await;

}