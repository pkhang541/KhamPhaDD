<?php
$p1 = json_decode(file_get_contents(__DIR__ . '/database/data/places_part1.json'), true);
$p2 = json_decode(file_get_contents(__DIR__ . '/database/data/places_part2.json'), true);
$p3 = json_decode(file_get_contents(__DIR__ . '/database/data/places_part3.json'), true);
$all = array_merge($p1, $p2, $p3);
file_put_contents(__DIR__ . '/database/data/places_raw.json', json_encode($all, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo 'Merged: ' . count($all) . ' places' . PHP_EOL;
