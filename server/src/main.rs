// https://github.com/vivlim/rolling-buffer-screen-capture/blob/238963d48995e1b2d288cc818a1ffbffb64bdf5c/src/main.rs

use image::ImageBuffer;
use turbojpeg::{Compressor, Image, PixelFormat};

// #[tokio::main]
// async fn main() {

//     let index_route = warp::path::end()
//                     .and(warp::fs::file("public/index.html"));

//     let js_route = warp::path("assets")
//                     .and(warp::fs::dir("public/assets"));

//     let routes = warp::get().and(
//         index_route
//         .or(js_route)
//     ).with(warp::cors().allow_any_origin());

//     println!("Starting server");
//     warp::serve(routes).run(([0, 0, 0, 0], 12345)).await;

// }

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut jpg = image::open("pic.jpg").expect("cannot open pic.jpg");

    let image = jpg.as_mut_rgb8().expect("cannot convert to rgb8");

    let width = 1920;
    let height = 1080;
    let pixels = image.as_raw();

    // initialize a Compressor
    let mut compressor = Compressor::new()?;

    // create an Image that bundles a reference to the raw pixel data (as &[u8]) with information
    // about the image format
    let image = Image {
        pixels: pixels.as_slice(),
        width: width,
        pitch: 3 * width, // there is no padding between rows
        height: height,
        format: PixelFormat::RGB,
    };

    compressor.set_quality(100);

    // compress the Image to a Vec<u8> of JPEG data
    let jpeg_data = compressor.compress_to_vec(image)?;

    std::fs::write("image5.jpg", jpeg_data)?;


    println!("coverted");

    Ok(())
}
